export interface ProcessStep {
  id: string;
  number: string;
  color: "ai" | "genai" | "quantum";
  title: string;
  description: string;
  items: Array<{
    label: string;
    description: string;
  }>;
}

export const researchProcess: ProcessStep[] = [
  {
    id: "step-01",
    number: "01",
    color: "ai",
    title: "문제에서 출발한다",
    description:
      "연구는 기술이 아니라 현장의 의사결정 문제에서 출발합니다. 산업과 조직의 실제 맥락을 깊이 이해하고, 증거를 기반으로 추진 및 해석하여 실질적인 변화를 이끌어낼 수 있는 연구 질문을 설정합니다.",
    items: [
      {
        label: "현장의 문제를 식별한다",
        description:
          "비즈니스 목표, 재무, 이해관계자 관점을 종합하여 해결이 시급하고 영향력이 큰 핵심 문제를 정의합니다.",
      },
      {
        label: "의사결정 맥락을 명확히 한다",
        description:
          "의사결정 구조, 프로세스, 성과 지표, 조직 문화 등 문제가 발생하는 맥락과 경계를 구체화합니다.",
      },
      {
        label: "증거를 수집하고 해석한다",
        description:
          "정량, 정성 데이터를 수집 및 분석하고, 인사이트를 도출해 실질적 임팩트가 있는 연구 질문을 구체화합니다.",
      },
    ],
  },
  {
    id: "step-02",
    number: "02",
    color: "genai",
    title: "설계하고 검증한다",
    description:
      "Design Science 접근을 통해 문제 해결에 기여하는 인공물(모델, 시스템 프레임워크 등)을 설계합니다. 현실 세계에서 실증과 검증을 통해 유용성과 가치를 입증하고, 반복적인 개선으로 완성도를 높입니다.",
    items: [
      {
        label: "인공물을 설계한다",
        description:
          "이론과 현장 인사이트를 결합하여 모델, 알고리즘, 시스템, 방법론, 프레임워크 등 해결책을 설계합니다.",
      },
      {
        label: "현실 세계에서 검증한다",
        description:
          "파일럿, 실험, A/B 테스트, 현장 적용 등을 통해 성능과 효과를 실증적으로 평가합니다.",
      },
      {
        label: "가치와 품질을 평가하고 개선한다",
        description:
          "유용성, 사용성, 실행 가능성, 조직 가치 등을 종합 평가하여 인사이트를 도출하고 반복적으로 개선합니다.",
      },
    ],
  },
  {
    id: "step-03",
    number: "03",
    color: "quantum",
    title: "다음 기술을 준비한다",
    description:
      "AI를 넘어 양자컴퓨팅까지, 기술 전환의 흐름을 선제적으로 이해하고 Quantum-ready 전환을 준비합니다. 사람, 프로세스, 기술 전반에 걸친 준비도를 높여 미래 가치 창출의 기반을 구축합니다.",
    items: [
      {
        label: "미래 기술을 탐색한다",
        description:
          "AI, 양자컴퓨팅, 데이터 보안, 자동화 등 핵심 기술 동향과 비즈니스 연향 시나리오를 체계적으로 수립합니다.",
      },
      {
        label: "Quantum-ready 전환 시나리오를 설계한다",
        description:
          "양자 기술 도입이 가능한 영역을 도출하고, 단계별 전환 로드맵과 기술, 데이터 전략을 수립합니다.",
      },
      {
        label: "조직의 준비도를 높이고 학습한다",
        description:
          "역량, 거버넌스, 인프라, 문화 측면의 준비도를 진단하고, 학합형 파일럿을 통해 미래 가치를 실현하고 확장합니다.",
      },
    ],
  },
];
