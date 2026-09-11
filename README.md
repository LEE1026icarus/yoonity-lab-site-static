# Yoonity Lab Site

동국대학교 경영정보학과 Yoonity Lab 공식 홈페이지입니다.

## Yoonity Lab 소개

Yoonity Lab은 산업 현장의 복잡한 문제를 AI와 데이터로 해결하는 연구실입니다.
현장의 문제에서 출발해 해결책을 설계하고 실증하며, 산학협력을 통해 실제 적용 가능성을 검증합니다.

주요 연구 분야는 다음과 같습니다.

- **AI 기반 예측과 의사결정**: 머신러닝과 데이터 분석을 활용한 수요 예측, 추천, 분류 및 산업 의사결정 연구
- **생성형 AI와 디지털 미디어**: 생성형 AI의 서비스·업무 적용과 사용자 경험 및 운영 효과 연구
- **Quantum-AI와 최적화**: 복잡한 최적화 문제와 양자컴퓨팅의 적용 가능성 및 Quantum-ready 전환 연구

연구진, 연구 성과, 활동 및 산학협력 안내는 [Yoonity Lab 홈페이지](https://www.yoonity.kr)에서 확인할 수 있습니다.

## Development

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## SEO configuration

배포 환경에는 검색엔진이 사용할 대표 도메인을 설정합니다.

```bash
NEXT_PUBLIC_SITE_URL=https://your-production-domain.example
```

값이 없고 Vercel에서 배포되는 경우 `VERCEL_PROJECT_PRODUCTION_URL`을 사용하며,
로컬 개발에서는 `http://localhost:3000`을 사용합니다.

## Validation

```bash
npm run lint
npm run build
```
