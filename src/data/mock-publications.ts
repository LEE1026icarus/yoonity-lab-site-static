import type { Publication } from "@/lib/types";

const intlPapers: string[] = [
  "Lee, S., & Yoon, S. H. (2026). Evolving dynamics of resistance and adoption in digital finance: A user review analysis of FinTech and traditional banking applications. Electronic Markets, 36(1), 45.",
  "Lee, S. H., Roh, T., Kim, E., & Yoon, S. H. (2026). Designing educational chatbots in resource-constrained environments: A design science approach. Technovation, 154, 103567.",
  "Sagynbayeva, A., Pyo, A., Yoon, S. H., & Yang, S. B. (2026). Evaluating user performance on RAG-based generative AI tools: A scenario-based experiment on AI-assisted information retrieval. Computers in Human Behavior, 108952.",
  "Roh, T., Kim, S., Kim, T., & Yoon, S. H. (2025). Unravelling the key topics of Hallyu: a cultural branding perspective from South Korea. Asia Pacific Business Review, 1–30.",
  "Yoon, S. H., Yang, S. B., & Lee, S. H. (2025). Comprehensive examination of the bright and dark sides of generative AI services: A mixed-methods approach. Electronic Commerce Research and Applications, 70, 101491.",
  "You, J., Jang, H., Kang, M., Yang, S. B., & Yoon, S. H. (2024). Leveraging Stock Discussion Forum Posts for Stock Price Predictions: Focusing on the Secondary Battery Sector. IEEE Access, 12, 153537-153549.",
  "Lee, J. Y., Kim, B., & Yoon, S. H. (2024). A conceptual digital policy framework via mixed-methods approach: Navigating public value for value-driven digital transformation. Government Information Quarterly, 41(3), 101961.",
  "Kim, S., Lee, J., Yoon, S. H., & Kim, H. W. (2023). How can we achieve better e-Learning success in the new normal?. Internet Research, 33(1), 410-441.",
  "Yu, S., Yang, S. B., & Yoon, S. H. (2023). The Design of an Intelligent Lightweight Stock Trading System Using Deep Learning Models: Employing Technical Analysis Methods, Systems 11(9), 470.",
  "Kim, H. L., Kim, Y. G., Yoon, S. H., & Ryu, S. (2023). Effect of Media Context on Avoidance of Skippable Pre-roll Ads in Online Video Platform: A Mental Accounting of Time Perspective. Journal of Business Research, 164, 113966.",
  "Kim, T., Chung, C., Brewster, C., & Yoon, S. H. (2023). Connecting managers' international work experience, advice networks, and subsidiary-unit performance: a social capital perspective. Multinational Business Review.",
  "Lee, M. H., Kim, S. J., Yoon, S. H., & Park, S. (2022). An integrative approach to determinants of pre-roll ad acceptance and their relative impact: Evidence from big data. Journal of Advertising, 51(1), 76-84.",
  "Yoon, S.-H., Park, G.-Y., & Kim, H.-W. (2022). Unraveling the Relationship between the Dimensions of User Experience and User Satisfaction: A Smart Speaker Case, Technology in Society, 71, 102067.",
  "Yoon, S. H., & Lee, S. H. (2022). What Likeability Attributes Attract People to Watch Online Video Advertisements?. Electronics, 11(13), 1960.",
  "Lee, S.-H., Yoon, S.-H., & Kim, H.-W. (2021). Prediction of Online Video Advertising Inventory Based on TV Programs: A Deep Learning Approach. IEEE Access, 9, 22516-22527.",
  "Yoon, S. H., Kim, H. W., & Kankanhalli, A. (2021). What makes people watch online TV clips? An empirical investigation of survey data and viewing logs. International Journal of Information Management, 59, 102329.",
  "Lee, M. H., Kim, S. J., Yoon, S. H., & Park, S. (2021). An Integrative Approach to Determinants of Pre-Roll Ad Acceptance and Their Relative Impact: Evidence from Big Data. Journal of Advertising, 51(1), 76–84.",
  "Yoon, S. H., & Kim, H. W. (2019). What Content and Context Factors Lead to Selection of a Video Clip? The Heuristic Route Perspective, Electronic Commerce Research, 19(3), 603-627.",
  "Yoon, S., Kim, H., & Kim, Y.-G. (2018). SMR: United against a Global Media Giant. Ivey Publishing. Available from Ivey Publishing product no. 9B18M090.",
];

const domesticPapers: string[] = [
  "이선녕, 구민규, 윤상혁. (2026). 핀테크 앱 리뷰에서 주제-주관성 상호작용이 유용성에 미치는 영향: PPM 기반 ZINB 모형 분석. 경영학연구, 55(2), 953-972.",
  "최은지, 윤상혁. (2025). 스타트업 인수 가능성에 영향을 미치는 신호 요인 분석: 자원기반관점과 신호이론의 통합적 접근. 벤처창업연구, 20(6), 145-159.",
  "이수연, 김은채, 윤상혁(2025). Z세대의 AI 학습 전략: Kolb 학습유형을 통한 맞춤형 접근. 한국IT서비스학회, 24(6), 185-206.",
  "이순형, 윤상혁. (2025). 청소년 게임 이용 행동 발달 궤적의 시계열 클러스터링 유형화와 자기결정이론 기반 심리 요인 분석, 경영정보화연구, 27:4, 345-370.",
  "이선녕, 윤상혁. (2025). 레스토랑 예약 앱 사용자 리뷰의 시계열적 감성 및 주제 반응 탐색: 정교화 가능성 모델 관점에서의 실증 분석. 경영학연구, 54(5), 1437-1455.",
  "이순형, 김형진, 윤상혁. (2025). 프롬프트 엔지니어링과 파인튜닝을 활용한 대규모 언어 모델 기반 한국어 혐오 표현 다중 레이블 분류 연구. 지능정보연구, 31(3), 227-248.",
  "김민균, 윤상혁 (2025). 경영정보학 분야의 인공지능 연구동향 탐색: 네트워크 분석과 전문가 인터뷰 기반 접근. 지식경영연구, 26(3), 351-374.",
  "표아진, 윤상혁. (2025). 외국인력 유입이 내국인력 일자리에 미치는 영향 분석 연구: 일자리 경쟁이론 기반 실증분석과 디지털 정책 대안. 정보화정책, 32(3), 88-109.",
  "Ajin Pyo, Eunyoung Lee, Sang-Hyeak Yoon. (2025). Identifying Industrial Safety Issues among Foreign Workers in South Korea: A BERTopic and Network-Based Analysis of News Article Data under the Employment Permit System. Asia Pacific Journal of Information Systems, Vol.35 No.2, [June 2025], 367-388.",
  "김은아, 양성병, 윤상혁. (2025). 유튜브 콘텐츠 활용 광고의 형태와 메시지 전략이 소비자 반응에 미치는 영향: 시나리오 기반 실험연구. 한국인터넷전자상거래학회, 25(3), 101-116.",
  "이현구, 양성병, 윤상혁. (2025). OCR 및 프롬프트 엔지니어링 기반 SEO 최적화 방안 연구: e커머스 상품 상세페이지 적용 사례. 정보시스템연구, 34(2), 27-43.",
  "서정우, 양성병, 윤상혁. (2025). 텍스트마이닝을 활용한 국내 스포츠 관련 키워드 추이 분석: COVID-19 팬데믹 전개 단계에 따른 변화를 중심으로. 지능정보연구, 31(2), 1-18.",
  "안해연, 윤상혁. (2025). 텍스트마이닝을 이용한 경영학부 교육과정 혁신 가능성 연구: K 대학을 중심으로. 지식경영연구, 26(2), 103-124.",
  "이순형, 김형진, 윤상혁. (2025). 열람실 로그데이터를 활용한 좌석 유형 분류 및 물리적 요인에 관한 연구: K대학교를 중심으로. 한국IT서비스학회지, 24(24), 67-85.",
  "정옥경, 박승범, 윤상혁, & 박철. (2024). 헬스케어 서비스의 디지털 채널 전환에 영향을 미치는 요인: ICT 기반 원격진료(Telemedicine)를 중심으로. 마케팅연구, 39(4), 53-74.",
  "이소현, 윤상혁. (2024). 엘리베이터 TV 광고의 인지 및 효과에 관한 연구: 실험적 접근과 EEG 분석. 지식경영연구, 25(3), 253-278.",
  "이소현, 나미정, & 윤상혁. (2024). 메타버스 투자를 위한 주요 요인 분석: 패션브랜드 기업 관점. 한국IT서비스학회지, 23(2), 63-81.",
  "조윤주, 김진수, 배환석, 양성병, 윤상혁. (2023). 머신러닝을 활용한 청년 구직자의 강소기업 선호 예측모형 개발 및 요인별 상대적 중요도 분석. 정보시스템연구, 32(4), 229-245.",
  "최재훈, 양성병, 윤상혁. (2023). 텍스트마이닝과 ChatGPT 분석을 활용한 기업과 대중의 ESG 인식 비교: 지속가능경영보고서와 소셜미디어를 기반으로. 지능정보연구, 29(4), 347-373.",
  "김선규, 박지현, 윤상혁, & 이소현. (2023). 스키리조트의 서비스스케이프에서 주요 고객가치 요인에 대한 연구. 서비스경영학회지, 24(5), 1-23.",
  "김은진, 김소담, 윤상혁, & 양성병. (2023). 간호업무 현장에서의 태움 예방 및 극복방안: PSOR 프레임워크를 기반으로. 서비스연구, 13(4), 70-96.",
  "양지훈, 홍무궁, 윤상혁. (2023). 콘텐츠 산업 투자 필요분야 도출을 통한 모태펀드 문화계정 개선 방안 연구. 문화정책논총, 37(3), 5-31.",
  "지영란, 양성병, 윤상혁. (2023). 패션 디자이너 브랜드의 개성과 SNS 특성이 브랜드 선호도 및 행동의도에 미치는 영향. 한국IT서비스학회지, 22(3), 119-139.",
  "오승묵, 양성병, 윤상혁. (2023). 아날로그 방식이 적용된 모바일앱에서의 어포던스가 애착, 만족도 및 지속이용의도에 미치는 영향. 서비스경영학회지, 24(2), 74-100.",
  "양지훈, 양성병, 윤상혁. (2023). 생성형 AI 서비스의 성공요인에 대한 탐색적 연구: 텍스트 마이닝과 ChatGPT를 활용하여. 경영정보학연구, 25(2), 125-144.",
  "박동근, 양성병, 윤상혁. (2023). 개인의 마이데이터 제공의도에 영향을 미치는 요인: 개인역량과 기관유형의 조절효과를 중심으로. 지식경영연구, 24(1), 73-97.",
  "왕진섭, 송재민, 양성병, 윤상혁. (2023). 개인의 건강신념이 모바일 헬스케어 앱 이용의도에 미치는 영향: m헬스 리터러시의 조절효과를 중심으로. 한국IT서비스학회지, 22(1), 95-114.",
  "학가위, 양성병, 윤상혁. (2022). 초현실 가상인플루언서에 대한 신뢰와 애착이 행동의도에 미치는 영향: 신뢰구축모델을 기반으로. 정보시스템연구, 31(4), 75-100.",
  "김정헌, 권지윤, 양성병, 윤상혁. (2022). 군인의 모바일 OTT 서비스 지속사용의도에 영향을 미치는 요인: 군복무형태의 조절효과를 중심으로. 서비스경영학회지, 23(5), 77-105.",
  "양지훈, 박찬욱, 윤상혁. (2022). 콘텐츠 산업의 임무지향형 R&D 추진을 위한 탐색적 연구: 임무(mission) 도출을 중심으로. 문화정책논총, 36(3), 57-79.",
  "김나경, 양성병, 윤상혁. (2022). 라이브 커머스 및 쇼호스트 특성이 소비자의 충동구매가능성에 미치는 영향: 시나리오 기반 실험연구. Information Systems Review, 24(4), 77-96.",
  "이소희, 김나경, 양성병, 윤상혁. (2022). 식품유형별 식품 유통기한 및 소비기한 표기방법에 대한 소비자 반응 분석: 시나리오 기반 실험연구. 서비스경영학회지, 23(4), 109-131.",
  "김성군, 양성병, 윤상혁. (2022). 브이튜버(Vtuber) 개인방송의 기술적 특성과 가상 크리에이터 특성이 즐거움, 시청만족도 및 유료후원의도에 미치는 영향: S-O-R 모델을 중심으로. 한국IT서비스학회지, 21(5), 107-127.",
  "양지훈, 윤상혁. (2022). 콘텐츠 창작자들의 NFT 시장 참여에 대한 긍·부정 요인 연구: 혼합적 방법론을 적용하여. 한국IT서비스학회지, 21(4), 105-122.",
  "윤상혁, 양지훈, 한진영, 김형진. (2022). 메타버스 성공 요인 분석을 위한 탐색적 연구: 텍스트 마이닝과 인터뷰 혼합방법론. 인터넷전자상거래연구, 22(1), 41-61.",
  "최윤진, 이소현, 윤상혁, 김희웅. (2020). Joint Sentiment 토픽모델링 기반 국내 여행 불만족 요인 연구. Korea Business Review, 24(2), 121-141.",
  "이소현, 김진솔, 윤상혁, 김희웅. (2020). 텍스트마이닝 기법을 이용한 모바일 피트니스 애플리케이션 주요 요인 분석: 사용자 경험 관점. 한국IT서비스학회지, 19, 117-137.",
  "문동지, 윤상혁, 최수빈, 김희웅. (2020). 머신러닝 기반의 보상형 크라우드펀딩의 성공 예측 모델링. Korea Business Review, 24(3).",
  "최수빈, 신동훈, 윤상혁, 김희웅. (2020). 암호화폐 가격 예측을 위한 딥러닝 앙상블 모델링: Deep 4-LSTM Ensemble Model. 한국IT서비스학회지, 19, 131-144.",
  "윤상혁, 최윤진, 이소현, 김희웅. (2020). 머신러닝 기반의 뷰티 커머스 고객 세그먼트 분류 및 활용 방안: 언택트 서비스 중심으로. Information Systems Review, 22(4), 75-92.",
  "윤상혁. (2020). Explaining Viewing Behavior of TV Clips Through a Mixed Methods Approach. 박사학위논문, 연세대학교.",
  "윤상혁, 이소현, 김희웅. (2019). 머신러닝 기반의 디지털 방송 프로그램 유형 분류 및 활용 방안 연구. 지식경영연구, 20(3), 119-137.",
  "윤상혁, 손지현, 고민삼, 김영걸. (2015). SNS 온라인 리뷰를 활용한 TV프로그램 품질평가연구. 방송통신연구, 90, 42-73.",
  "윤상혁 (2014). 시청자의 온라인 리뷰를 활용한 TV프로그램의 정성적 가치측정. 석사학위논문, 한국과학기술원.",
];

const books: { title: string; publisher: string; authors: string; date: string }[] = [
  {
    title: "경영혁신을 위한 생성형 AI 이해와 활용",
    publisher: "십일프로(11%)",
    authors: "윤상혁, 이소현",
    date: "2024.02.29",
  },
  {
    title: "생성형 AI로 여는 교육의 미래",
    publisher: "한국기술교육대학교 출판부",
    authors: "윤상혁",
    date: "2024.02.15",
  },
  {
    title: "AI와 데이터 분석 기초",
    publisher: "박영사",
    authors: "윤상혁, 양지훈",
    date: "2021.02.25",
  },
];

const patents: { title: string; number: string; inventors: string }[] = [
  {
    title: "생성형 인공지능 기반 고객맞춤형 리뷰답변 생성시스템 및 그 방법",
    number: "10-2026-0032026",
    inventors: "윤상혁, 이순형",
  },
  {
    title: "AI 에이전트 기반 인플루언서 평가 장치 및 방법",
    number: "10-2025-0179449",
    inventors: "윤상혁",
  },
  {
    title: "생성형 AI 기반 맞춤형 온라인 교육 시스템 및 그 방법",
    number: "10-2024-0183821",
    inventors: "윤상혁, 이순형, 김민균, 김학수",
  },
  {
    title: "생성형 인공지능 기반 고객 맞춤형 리뷰답변 생성시스템 및 그 방법",
    number: "10-2024-0117932",
    inventors: "윤상혁, 이순형, 양성병, 장하렴",
  },
  {
    title: "생성형 인공지능 기반 배너광고이미지 자동생성장치 및 그 방법",
    number: "10-2023-0051944",
    inventors: "황종휘, 윤상혁",
  },
];

export const mockPublications: Publication[] = [
  ...intlPapers.map((citation, i) => ({
    id: `intl-${i}`,
    category: "intl-paper" as const,
    title: citation,
  })),
  ...domesticPapers.map((citation, i) => ({
    id: `domestic-${i}`,
    category: "domestic-paper" as const,
    title: citation,
  })),
  ...books.map((book, i) => ({
    id: `book-${i}`,
    category: "book" as const,
    title: book.title,
    meta: `${book.publisher} · ${book.authors} · ${book.date}`,
  })),
  ...patents.map((patent, i) => ({
    id: `patent-${i}`,
    category: "patent" as const,
    title: patent.title,
    meta: `${patent.number} · ${patent.inventors}`,
  })),
];
