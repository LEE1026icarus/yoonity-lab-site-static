import type { Professor } from "@/lib/types";

export const professor: Professor = {
  name: "윤상혁",
  photo: "/images/professor/yoon-sanghyeak.avif",
  title: "동국대학교 경영정보학과 교수 | 데이터사이언티스트 | AI 연구자",
  email: "yoonsh@dgu.ac.kr",
  links: [
    { label: "LinkedIn", href: "https://kr.linkedin.com/in/sanghyeak-yoon-5aa5aa25" },
    {
      label: "Notion",
      href: "https://understood-hemisphere-33a.notion.site/Sang-Hyeak-Yoon-4e6cf5648dc9447c9a123af5e29c2ead",
    },
  ],
  expertise: [
    "생성형 AI 연구 및 관련 저서 다수 출간",
    "AI 서비스 및 빅데이터 환경 구축 프로젝트 경험 풍부",
    "딥러닝·머신러닝 기반 추천 알고리즘 개발 및 정형·비정형 데이터 분석 전문성",
  ],
  career: [
    {
      id: "career-dgu",
      org: "동국대학교",
      role: "경영정보학과 교수",
      location: "서울",
      period: "2025년 3월 -",
    },
    {
      id: "career-koreatech",
      org: "한국기술교육대학교 (KOREATECH)",
      role: "산업경영학부 조교수",
      location: "충남 천안",
      period: "2022년 3월 – 2025년 2월",
      bullets: [
        "생성형 AI와 데이터 분석 강의 및 연구 수행",
        "AI 기반 서비스 기획 및 개발 프로젝트 참여",
      ],
    },
    {
      id: "career-smr",
      org: "스마트미디어렙 (SMR)",
      role: "데이터 사이언티스트",
      location: "서울",
      period: "2019년 12월 – 2022년 2월",
      bullets: [
        "데이터 마이닝 및 Python 기반 데이터 분석",
        "Google Analytics, Google Data Studio 활용 디지털 마케팅 성과 분석",
      ],
    },
    {
      id: "career-sbs",
      org: "SBS I&M",
      role: "방송서비스팀 서비스 기획",
      location: "서울",
      period: "2012년 12월 – 2019년 12월",
      bullets: ["방송 콘텐츠 플랫폼 서비스 기획 및 UX 개선"],
    },
    {
      id: "career-kth",
      org: "KTH",
      role: "TV Application팀 서비스 기획",
      location: "서울",
      period: "2010년 1월 – 2012년 12월",
      bullets: ["TV 애플리케이션 서비스 신규 론칭 및 시장 분석"],
    },
  ],
  education: [
    {
      id: "edu-yonsei",
      org: "연세대학교",
      role: "정보시스템학 박사",
      location: "서울 | 정보대학원",
      period: "2016년 9월 – 2020년 8월",
    },
    {
      id: "edu-kaist",
      org: "한국과학기술원 (KAIST)",
      role: "경영학 석사 (정보경영 전공)",
      location: "서울",
      period: "2012년 9월 – 2014년 8월",
    },
    {
      id: "edu-dongguk",
      org: "동국대학교",
      role: "경영학 학사 (경영·광고 전공)",
      location: "서울",
      period: "2002년 3월 – 2009년 2월",
    },
  ],
  skills: [
    "LLM 파인튜닝 및 프롬프트 엔지니어링",
    "데이터 분석 및 프로그래밍 언어: Python, STATA, SPSS",
    "디지털 마케팅 툴 활용: Google Analytics, Google Data Studio",
    "빅데이터 환경 구축 및 DB 설계: IBM DB2 BLUE, SQL",
  ],
  other: [
    {
      id: "other-kepco",
      org: "한국전력공사",
      role: "감사자문위원 (정책 및 사업 성과)",
      location: "전남 나주",
      period: "2025년 10월 - 2026년 9월",
    },
    {
      id: "other-nrf",
      org: "한국연구재단",
      role: "감사자문위원",
      location: "",
      period: "2025년 12월 - 2027년 12월",
    },
  ],
};
