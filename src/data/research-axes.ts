import type { ResearchAxis } from "@/lib/types";

export const researchAxes: ResearchAxis[] = [
  {
    id: "axis-01",
    color: "ai",
    tag: "AXIS 01",
    title: "AI 기반 예측과 의사결정",
    titleEn: "AI Prediction & Decision Making",
    description:
      "머신러닝과 데이터 분석으로 산업 현장의 예측 문제를 풀고, 조직이 AI를 신뢰하고 수용하는 조건을 실증한다.",
    keywords: ["Machine Learning", "Analytics", "Adoption"],
  },
  {
    id: "axis-02",
    color: "genai",
    tag: "AXIS 02",
    title: "생성형 AI와 디지털 미디어",
    titleEn: "Generative AI & Digital Media",
    description:
      "생성형 AI가 만드는 새로운 서비스와 미디어 경험을 설계하고, 사용자 행동과 비즈니스 가치를 탐구한다.",
    keywords: ["Generative AI", "UX", "Service Design"],
  },
  {
    id: "axis-03",
    color: "quantum",
    tag: "AXIS 03",
    title: "Quantum-AI와 최적화",
    titleEn: "Quantum-AI and Optimization",
    description:
      "양자컴퓨팅의 산업 적용과 조직 수용, 비즈니스 가치를 IS 관점에서 연구한다. Quantum-ready 전환의 프레임워크를 설계한다.",
    keywords: ["Quantum Computing", "Optimization", "DSR"],
  },
];
