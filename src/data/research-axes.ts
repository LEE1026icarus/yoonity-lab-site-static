import type { ResearchAxis } from "@/lib/types";

export const researchAxes: ResearchAxis[] = [
  {
    id: "axis-01",
    color: "ai",
    tag: "AXIS 01",
    title: "AI 기반 예측과 의사결정",
    titleEn: "AI Prediction & Decision Making",
    description:
      "수요 예측, 추천, 분류와 같은 의사결정 문제를 머신러닝과 데이터 분석으로 모델링하고, 실제 성과와 조직 수용 조건을 검증합니다.",
    keywords: ["Machine Learning", "Analytics", "Adoption"],
  },
  {
    id: "axis-02",
    color: "genai",
    tag: "AXIS 02",
    title: "생성형 AI와 디지털 미디어",
    titleEn: "Generative AI & Digital Media",
    description:
      "생성형 AI가 필요한 서비스와 업무 맥락을 정의하고, 사용자 경험과 운영 효과를 함께 검증해 적용 가능한 형태로 발전시킵니다.",
    keywords: ["Generative AI", "UX", "Service Design"],
  },
  {
    id: "axis-03",
    color: "quantum",
    tag: "AXIS 03",
    title: "Quantum-AI와 최적화",
    titleEn: "Quantum-AI and Optimization",
    description:
      "복잡한 최적화 문제를 중심으로 양자컴퓨팅의 미래 적용 가능성과 조직의 준비 조건을 연구하고, 단계적인 Quantum-ready 전환 방향을 설계합니다.",
    keywords: ["Quantum Computing", "Optimization", "DSR"],
  },
];
