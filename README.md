# 이미지 뚝딱기

**이미지를 도형으로 자르고, 용지에 맞게 나누고, 뚝딱 저장하세요!**  
교육 자료, 유아 교구, 증명사진, 포스터 제작에 유용한 이미지 편집 도구입니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| ✂️ 이미지 자르기 | 원형, 둥근 사각형, 하트 등 도형 마스크로 이미지 자르기 |
| 📐 비율 설정 | 사각형 자르기 시 가로:세로 비율을 자유롭게 선택 가능 |
| 📥 저장 기능 | 현재 이미지 저장 / 전체 이미지 ZIP 저장 |
| ➗ 이미지 분할 | A4, A3, B4 등의 용지 기준으로 이미지 조각 분할 |
| 🖨 PDF 저장 | 분할된 이미지 조각을 한 페이지씩 PDF로 저장 |

---

## 웹 앱 바로가기

👉 [https://pukkok.github.io/img-ttukttakki](https://pukkok.github.io/img-ttukttakki)

---

## 사용 예시

- 유치원 교사: 아이 얼굴 이미지를 하트나 원형, 둥근 사각형 모양으로 자르기
- 초등 교사: 학습 카드 제작용으로 이미지 분할

---

## 개발 정보

- React + Vite 기반 SPA
- GitHub Pages를 통한 정적 배포
- 상태 관리: useState
- 사용 라이브러리:
  - [jsPDF](https://github.com/parallax/jsPDF): PDF 저장
  - [JSZip](https://github.com/Stuk/jszip): ZIP 압축
  - [file-saver](https://github.com/eligrey/FileSaver.js): 파일 다운로드

---

## 업데이트 노트 (v0.1.0)

- padding/bleed 기능은 인쇄 및 오려붙이기 용도에 최적화하기 위해 도입
- 여백과 재단 여유 간 계산 논리가 꼬이기 쉬워 설계에 신중함을 기함
- DPI 혼동 문제를 해결하기 위해 **이미지 비율 유지** 방식을 채택

---

## 프로젝트 실행

```bash
# 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# GitHub Pages 배포
npm run deploy
