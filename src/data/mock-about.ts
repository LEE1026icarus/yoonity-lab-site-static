import type { AboutPageData } from "@/lib/types";

const newsBase = "https://www.yoonity.kr/%EB%89%B4%EC%8A%A4-%EA%B8%B0%EC%82%AC";

export const mockAboutPageData: AboutPageData = {
  collaborationEmail: "yoonity25@gmail.com",
  recruitmentHref:
    "https://www.notion.so/Yoonity-27f8edb3cd7280a19b16d907d41e4bfb?source=copy_link",
  resources: [
    {
      id: "professor-resume",
      title: "윤상혁 교수 이력서",
      description: "지도교수의 연구, 교육과 산업 경력을 확인합니다.",
      href: "https://drive.google.com/file/d/1CJuTbGrJyv4uFiZLdQNa2JArYXwwP3j0/view?usp=sharing",
      order: 1,
    },
    {
      id: "lab-brochure",
      title: "Yoonity 연구실 소개서",
      description: "연구 분야와 프로젝트, 연구실 활동을 한눈에 살펴봅니다.",
      href: "https://drive.google.com/file/d/1jELjzPdlx3bWwSyI5rTg_8YvO_uN7J-9/view?usp=sharing",
      order: 2,
    },
  ],
  channels: [
    { id: "blog", title: "Blog", status: "coming-soon", order: 1 },
    { id: "github", title: "GitHub", status: "coming-soon", order: 2 },
  ],
  news: [
    {
      id: "genai-edu-award-2024",
      date: "2024-12-05",
      title: "한기대, '생성형 AI 활용 교육 혁신 우수사례 공모전 발표회' 개최",
      excerpt: "AI 교수님과 채팅, 영화와 동화책 제작, 팀 프로젝트로 학업성취도 향상",
      href: `${newsBase}/1`,
      order: 1,
    },
    {
      id: "data-fighter-2024",
      date: "2024-09-05",
      title: "한기대, '데이터 파이터' 이색 경진대회",
      excerpt: "'대학 교육 데이터 활용 아이디어와 방향성 제시' 주제",
      href: `${newsBase}/2`,
      order: 2,
    },
    {
      id: "seoul-principals-visit-2024",
      date: "2024-08-22",
      title: "서울 초중고 교장 \"한국기술교육대, 변화하는 시대 앞서가는 대학\"",
      excerpt: "서울시교육청 연수 참가자 20명 '다담미래학습관' 탐방, 'AI 강연·체험'도",
      href: `${newsBase}/3`,
      order: 3,
    },
    {
      id: "professor-feature-2024",
      date: "2024-03-04",
      title: "'생성형 AI' 접목 경영교육 혁신 이끈 윤상혁 교수",
      excerpt: "'인공지능과 경영'에서 첨단기술 이해와 프로젝트 기획, 학습자 혁신 사고 촉진",
      href: `${newsBase}/4`,
      order: 4,
    },
    {
      id: "grabit-platform-2023",
      date: "2023-09-25",
      title: "\"엄마 가게 도우려 만든 AI 플랫폼\", 친구와 함께 개발",
      excerpt: "한국기술교육대 박예실 씨, AI 기반 숏폼 자동생성 플랫폼 개발",
      href: `${newsBase}/5`,
      order: 5,
    },
    {
      id: "erp-idea-award-2023",
      date: "2023-06-13",
      title: "영림원소프트랩, ERP 아이디어 공모전 성료",
      excerpt: "학회지 '경영정보학연구' 우수 논문 시상",
      href: `${newsBase}/6`,
      order: 6,
    },
  ],
};
