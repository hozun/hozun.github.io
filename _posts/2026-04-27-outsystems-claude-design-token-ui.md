---
layout: post
title: "OutSystems + Claude로 디자인 토큰 기반 UI 개발하기"
date: 2026-04-27 09:49:00 +0900
tags: [인공지능, 개발, 로우코드, 팁]
description: "디자인 토큰 → 레이아웃 시안 → O11 Theme 적용까지, Figma 없이 Claude만으로 일관된 UI 파이프라인을 만드는 방법."
---

> AI를 활용한 디자인 토큰 → 레이아웃 시안 → O11 적용까지의 전체 프로세스 정리

---

## 전체 프로세스 개요

```
[디자인 결정]
  브랜드 컬러, 간격, 폰트 등
          ↓
[토큰 정의]
  tokens.json 또는 CSS 변수
          ↓
      ┌───────────────┐
      │  Claude 활용  │
      └───────────────┘
      ↓             ↓
[레이아웃 시안]    [토큰 변환]
  자연어로 요청     CSS :root 블록
      ↓             ↓
      └──────┬───────┘
             ↓
    [O11 Theme CSS에 적용]
      Custom Theme :root 수정
             ↓
    [Service Studio에서 구현]
      Widget 배치 + 스타일 적용
             ↓
    [앱 전체 반영]
```

---

## 각 단계 상세

### 1단계. 디자인 토큰 정의

디자인 토큰은 색상, 간격, 폰트 등 디자인 결정을 **변수화**한 것이다. OutSystems O11은 CSS 변수 형태로 토큰을 관리한다.

```css
:root {
    --color-primary: #ca6924;
    --color-secondary: #ca6924;
    --color-primary-hover: #984f1b;
    --color-primary-selected: rgba(202, 105, 36, .12);
}
```

토큰을 잘 정의해두면 값 하나만 바꿔도 앱 전체에 일관성 있게 반영된다.

---

### 2단계. Claude로 레이아웃 시안 생성

토큰과 컴포넌트 스펙을 Claude에게 컨텍스트로 전달하고 자연어로 레이아웃을 요청한다.

**프롬프트 예시:**

```
아래는 우리 O11 디자인 토큰과 컴포넌트 목록이야.

토큰:
--color-primary: #ca6924
--font-size-base: 14px
--spacing-m: 16px

컴포넌트:
- Input (텍스트 입력)
- Dropdown (선택)
- Table Records (목록 조회)
- Button (액션)

이걸로 고객 조회 화면 레이아웃을
O11 Widget 구조로 설계해줘.
```

Claude는 O11 Widget 기준으로 화면 구조와 CSS 스펙을 함께 생성해준다.

---

### 3단계. 토큰 변경 시 Claude 활용

새 브랜드 가이드가 생겼을 때 Claude로 빠르게 변환할 수 있다.

**프롬프트 예시:**

```
현재 O11 Custom Theme CSS야:

:root {
    --color-primary: #ca6924;
    --color-primary-hover: #984f1b;
    --color-primary-selected: rgba(202, 105, 36, .12);
}

새 브랜드 컬러는 Primary: #0057FF 야.
hover, selected 값도 자동 계산해서
위 CSS 형식으로 업데이트해줘.
```

→ 바로 붙여넣기 가능한 `:root` 블록이 생성된다.

---

### 4단계. O11 Theme CSS에 적용

Service Studio에서 Custom Theme의 Style Sheet 탭을 열고 `:root` 블록을 수정한다.

```
Service Studio
→ Interface 탭
→ Themes → Custom Theme 선택
→ Style Sheet 탭
→ :root { } 수정
→ 1-Click Publish
```

**주의:** Base Theme은 직접 수정 불가. 반드시 Custom Theme에서 오버라이드해야 한다.

```
Base Theme (수정 불가)
      ↓ 상속
Custom Theme (여기서 :root 오버라이드)  ← 여기만 수정
      ↓
앱 전체 반영
```

---

### 5단계. Service Studio에서 Widget 구현

Claude가 생성한 레이아웃 스펙을 보고 Service Studio에서 Widget을 배치한다.

| Claude 시안 | O11 Widget |
|---|---|
| 텍스트 입력 필드 | Input Widget |
| 드롭다운 | Dropdown Widget |
| 목록 테이블 | Table Records |
| 버튼 | Button Widget |
| Flex 레이아웃 | Container + Column |

---

## 각 단계에서 Claude의 역할 요약

| 단계 | Claude가 하는 것 |
|---|---|
| 토큰 설계 | 브랜드 가이드 → tokens.json 또는 CSS 변수 변환 |
| 레이아웃 시안 | 자연어 → O11 Widget 구조 + CSS 스펙 생성 |
| 토큰 업데이트 | 새 값 → :root CSS 블록 자동 생성 |
| 구현 가이드 | 시안 → Service Studio 작업 순서 설명 |

---

## PoC에서 검증할 핵심 질문

1. **토큰 → 시안**: Claude가 O11 토큰을 인식하고 일관된 레이아웃을 만드는가?
2. **시안 → 구현**: Claude의 Widget 구조 가이드가 실제 O11 작업에 얼마나 유용한가?
3. **토큰 변경 → 반영**: 새 토큰을 Claude로 변환해서 O11에 적용하는 속도가 얼마나 빠른가?

---

## 정리

Figma 유료 플랜이나 별도 툴 없이도, **디자인 토큰 + Claude + O11 Theme CSS** 조합만으로 일관된 UI 개발 파이프라인을 구축할 수 있다. 특히 폐쇄망 환경의 O11 프로젝트에서는 이 방식이 현실적인 AI 활용 접근법이다.
