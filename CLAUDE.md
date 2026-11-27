@AGENTS.md

# 프로젝트 지침

## 디자인 원칙 — iOS 스타일

이 앱은 iOS 네이티브 느낌을 최우선으로 한다.

- **색상**: 단일 액센트 #007AFF. 빨강/초록/주황 등 추가 색상 사용 최소화. 위험/초과는 `t.btnDark`(다크 모드 대응) 사용
- **배경/카드**: 흰 배경(`t.bg`), 카드(`t.card`), 구분선은 `StyleSheet.hairlineWidth`
- **모서리**: 카드 14~18px, 버튼 12~16px, 소형 요소 8~10px
- **그림자**: shadowOpacity 0.04~0.08, shadowRadius 6~10, elevation 1~2
- **폰트**: `-apple-system` 계열, 굵기로 위계 표현. `TYPE` 시스템 활용
- **간격**: 넉넉한 padding, 요소 간 충분한 여백
- **모달**: 하단 슬라이드업, 배경 dimming `rgba(0,0,0,0.45)`
- **반투명 버튼**: `rgba(120,120,128,0.18)` + `backdrop-filter: blur`
- **애니메이션**: 부드럽고 과하지 않게

## UI/UX 원칙

- **언어**: 모든 UI는 한국어. 영어 약어(YTD 등) 사용 금지 → "올해 집행" 등으로 대체
- **정보 밀도**: 2열 카드 그리드 선호 (항목이 많을 때)
- **분석 화면**: 단순 목록 나열 지양. 그래프·진행 바·요약 수치 중심으로 구성
- **보고서**: 분석과 인사이트 중심. 원시 데이터 나열 금지

## 배포 루틴

매 배포 시 아래 순서를 반드시 따른다:

```bash
# 1. 캐시 제거 빌드 (변경사항 미반영 시 --clear 사용)
npx expo export --platform web --clear

# 2. PWA 파일 복사
cp assets/apple-touch-icon.png dist/
cp assets/icon-192.png dist/
cp assets/icon-512.png dist/

# 3. manifest.json 생성
cat > dist/manifest.json << 'EOF'
{"name":"가계부","short_name":"가계부","description":"가족 가계부 앱","start_url":"/","display":"standalone","orientation":"portrait","theme_color":"#007AFF","background_color":"#F2F2F7","lang":"ko","icons":[{"src":"/icon-192.png","sizes":"192x192","type":"image/png","purpose":"any maskable"},{"src":"/icon-512.png","sizes":"512x512","type":"image/png","purpose":"any maskable"}]}
EOF

# 4. index.html PWA 메타태그 주입
sed -i '' 's|<link rel="icon" href="/favicon.ico" /></head>|<link rel="manifest" href="/manifest.json" /><meta name="apple-mobile-web-app-capable" content="yes" /><meta name="apple-mobile-web-app-status-bar-style" content="default" /><meta name="apple-mobile-web-app-title" content="가계부" /><link rel="apple-touch-icon" href="/apple-touch-icon.png" /><link rel="icon" href="/favicon.ico" /></head>|' dist/index.html

# 5. Firebase 배포
firebase deploy --only hosting
```

## 커뮤니케이션 원칙

- 사용자가 잘 모르는 영역에 대해 도움을 요청할 때, 불필요한 작업이라면 이유와 함께 명확히 "필요 없습니다"라고 먼저 말한다
- 대안이 더 간단하다면 적극적으로 제안한다
- 불필요한 복잡성을 추가하지 않는다

## 기술 스택 참고

- React Native Expo SDK 54, 웹 타겟 (Firebase Hosting)
- Firebase Auth (자동 로그인) + Firestore (데이터 저장)
- TransactionContext: 전체 거래 내역 전역 캐시, 변경 후 `refresh()` 호출
- `TYPE` 시스템: `src/theme.js`의 타이포그래피 상수
- 테마: `useTheme()` → `t.accent`, `t.card`, `t.bg`, `t.text`, `t.textSub` 등
