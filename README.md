# Yoonity Lab Site

동국대학교 경영정보학과 Yoonity 연구실 홈페이지입니다.

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
