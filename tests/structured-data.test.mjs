import assert from "node:assert/strict";
import test from "node:test";

import {
  createAboutPageStructuredData,
  createNewsStructuredData,
  createOrganizationStructuredData,
  createProjectStructuredData,
  createProfessorStructuredData,
  createPublicationStructuredData,
  serializeJsonLd,
} from "../src/lib/structured-data.ts";
import {
  getNewsDetail,
  getProjectDetail,
  getPublicationDetail,
} from "../src/lib/content-details.ts";

const baseUrl = new URL("https://lab.example.edu/");

test("organization and AboutPage share one stable organization identity", () => {
  const organization = createOrganizationStructuredData(baseUrl);
  const about = createAboutPageStructuredData(baseUrl);

  assert.equal(organization["@context"], "https://schema.org");
  assert.equal(organization["@type"], "ResearchOrganization");
  assert.equal(organization["@id"], "https://lab.example.edu/#organization");
  assert.equal(organization.url, "https://lab.example.edu/");
  assert.equal(organization.logo, "https://lab.example.edu/yoonity-logo-black.png");
  assert.equal(organization.email, "yoonity25@gmail.com");
  assert.equal(organization.parentOrganization.name, "동국대학교");

  assert.equal(about["@type"], "AboutPage");
  assert.equal(about["@id"], "https://lab.example.edu/about#about-page");
  assert.equal(about.url, "https://lab.example.edu/about");
  assert.equal(about.mainEntity["@id"], organization["@id"]);
});

test("professor structured data connects ProfilePage to a repository-backed Person", () => {
  const professor = {
    name: "윤상혁",
    title: "동국대학교 경영정보학과 교수 | 데이터사이언티스트 | AI 연구자",
    email: "yoonsh@dgu.ac.kr",
    photo: "/images/professor/yoon-sanghyeak.avif",
    links: [
      {
        label: "LinkedIn",
        href: "https://kr.linkedin.com/in/sanghyeak-yoon-5aa5aa25",
      },
    ],
    expertise: ["생성형 AI", "양자컴퓨팅"],
    career: [],
    education: [],
    skills: [],
    other: [],
  };

  const structuredData = createProfessorStructuredData(professor, baseUrl);
  const [profilePage, person] = structuredData["@graph"];

  assert.equal(profilePage["@type"], "ProfilePage");
  assert.equal(profilePage.url, "https://lab.example.edu/professor");
  assert.equal(profilePage.mainEntity["@id"], "https://lab.example.edu/professor#person");
  assert.equal(profilePage.about?.["@id"], "https://lab.example.edu/#organization");
  assert.equal(profilePage.isPartOf, undefined);

  assert.equal(person["@type"], "Person");
  assert.equal(person["@id"], profilePage.mainEntity["@id"]);
  assert.equal(person.name, "윤상혁");
  assert.equal(person.jobTitle, "교수");
  assert.equal(person.affiliation.name, "동국대학교 경영정보학과");
  assert.equal(person.image, "https://lab.example.edu/images/professor/yoon-sanghyeak.avif");
  assert.equal(person.email, "yoonsh@dgu.ac.kr");
  assert.deepEqual(person.sameAs, [
    "https://kr.linkedin.com/in/sanghyeak-yoon-5aa5aa25",
  ]);
  assert.deepEqual(person.knowsAbout, ["생성형 AI", "양자컴퓨팅"]);
});

test("structured data omits blank optional values and escapes script-breaking markup", () => {
  const structuredData = createProfessorStructuredData(
    {
      name: "윤상혁",
      title: "동국대학교 경영정보학과 교수",
      email: " ",
      photo: "",
      links: [
        { label: "Blank", href: " " },
        { label: "Profile", href: "https://example.edu/profile" },
      ],
      expertise: ["생성형 AI", ""],
      career: [],
      education: [],
      skills: [],
      other: [],
    },
    baseUrl,
  );
  const serialized = serializeJsonLd({
    value: "</script>",
    blank: " ",
    missing: undefined,
    emptyList: [],
  });

  assert.doesNotMatch(JSON.stringify(structuredData), /undefined|:""|:" "/);
  assert.doesNotMatch(JSON.stringify(structuredData), /"image"|"email"/);
  assert.deepEqual(structuredData["@graph"][1].sameAs, [
    "https://example.edu/profile",
  ]);
  assert.deepEqual(structuredData["@graph"][1].knowsAbout, ["생성형 AI"]);
  assert.equal(serialized, '{"value":"\\u003c/script>"}');
  assert.doesNotMatch(serialized, /</);
});

test("professor structured data ignores malformed and non-web optional URLs", () => {
  let structuredData;

  assert.doesNotThrow(() => {
    structuredData = createProfessorStructuredData(
      {
        name: "윤상혁",
        title: "동국대학교 경영정보학과 교수",
        email: "yoonsh@dgu.ac.kr",
        photo: "https://[invalid",
        links: [
          { label: "Malformed", href: "https://[invalid" },
          { label: "Relative", href: "/relative-profile" },
          { label: "Mail", href: "mailto:yoonsh@dgu.ac.kr" },
          { label: "Script", href: "javascript:alert(1)" },
          { label: "Valid", href: "https://example.edu/profile" },
        ],
        expertise: ["생성형 AI"],
        career: [],
        education: [],
        skills: [],
        other: [],
      },
      baseUrl,
    );
  });

  const person = structuredData["@graph"][1];
  assert.equal(person.image, undefined);
  assert.deepEqual(person.sameAs, ["https://example.edu/profile"]);
});

test("detail structured data uses only repository-backed fields", async () => {
  const [news, project, publication] = await Promise.all([
    getNewsDetail("genai-edu-award-2024"),
    getProjectDetail("project-1"),
    getPublicationDetail("intl-0"),
  ]);
  const newsData = createNewsStructuredData(news, baseUrl);
  const projectData = createProjectStructuredData(project, baseUrl);
  const publicationData = createPublicationStructuredData(publication, baseUrl);

  assert.equal(newsData["@type"], "NewsArticle");
  assert.equal(newsData.datePublished, "2024-12-05");
  assert.equal(newsData.articleBody, undefined);
  assert.equal(projectData["@type"], "ResearchProject");
  assert.equal(projectData.funder, undefined);
  assert.equal(publicationData["@type"], "ScholarlyArticle");
  assert.equal(publicationData.author, undefined);
  assert.equal(JSON.stringify(publicationData).includes("undefined"), false);
});
