import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Breadcrumbs } from "../src/components/breadcrumbs.tsx";
import { createBreadcrumbStructuredData } from "../src/lib/structured-data.ts";

const items = [
  { label: "홈", href: "/" },
  { label: "연구과제·수상·대외활동", href: "/activities" },
  { label: "올바로 시스템 관련 상하위법 챗봇 개발", href: "/projects/project-1" },
];

test("Breadcrumbs renders crawlable navigation and marks the current page", () => {
  const markup = renderToStaticMarkup(createElement(Breadcrumbs, { items }));

  assert.match(markup, /aria-label="현재 위치"/);
  assert.match(markup, /href="\/activities"/);
  assert.match(markup, /aria-current="page"/);
  assert.match(markup, /올바로 시스템 관련 상하위법 챗봇 개발/);
});

test("BreadcrumbList structured data uses ordered absolute URLs", () => {
  const data = createBreadcrumbStructuredData(items, new URL("https://lab.example.edu/"));

  assert.equal(data["@type"], "BreadcrumbList");
  assert.deepEqual(data.itemListElement[2], {
    "@type": "ListItem",
    position: 3,
    name: "올바로 시스템 관련 상하위법 챗봇 개발",
    item: "https://lab.example.edu/projects/project-1",
  });
});
