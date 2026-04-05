# ReadMyToon 📽️

> "밋밋한 README를 인터랙티브한 웹툰으로 변환하는 AI 서비스"

## 🚀 프로젝트 개요
README의 텍스트와 구조를 분석하여 스토리보드를 생성하고, AI 이미지 생성 모델을 통해 이를 한 편의 웹툰으로 시각화해 주는 CLI 툴입니다.

## ✨ 주요 기능
*   **지능형 파싱**: README의 컨텍스트와 흐름을 AI로 분석하여 스토리 추출.
*   **웹툰 생성**: LangChain과 OpenAI(DALL-E)를 연동하여 각 섹션을 툰 장면으로 변환.
*   **CLI 인터페이스**: 개발 환경에서 명령어로 손쉽게 변환 가능 (`readmytoon`).

## 🛠 기술 스택
*   **Language**: TypeScript (tsup)
*   **AI Framework**: LangChain, OpenAI
*   **Dev Tool**: ts-node, ts-config
