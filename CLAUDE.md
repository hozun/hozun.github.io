# md-blog 프로젝트 지침

Jekyll 기반 개인 블로그 (https://hozun.github.io). GitHub Pages로 호스팅.

## 포스트 작성 규칙

### 파일명
`_posts/YYYY-MM-DD-slug.md` 형식. slug는 영문 소문자 + 하이픈.

### 프론트매터 필수 필드
```yaml
---
layout: post
title: "제목"
date: YYYY-MM-DD HH:MM:SS +0900
tags: [태그1, 태그2]
description: "한두 줄 요약. 검색/미리보기에 표시됨."
---
```

- `date`는 항상 `+0900` (KST) 기준
- 날짜/시간은 항상 오늘 날짜의 현재 시간 기준으로 작성

### 사용 가능한 태그 (`_tags/` 디렉토리 기준)
개발, 교육, 기업IT, 등산, 로우코드, 리뷰, 인공지능, 일상, 입시, 팁, 원격접속, 맥, iOS, 생산성

새 태그가 필요하면 `_tags/태그명.md` 파일도 함께 생성.

### 글 스타일
- 대상 독자: 어느 정도 배경 지식이 있는 독자 (완전 초보 X, 전문가 X)
- 결론/핵심을 앞에 먼저 제시하고 전개
- 표, 코드블록, 다이어그램 적극 활용 (구조적 다이어그램은 Mermaid — 아래 섹션 참고)
- 섹션 구분은 `---` 수평선 사용
- 마케팅 문구, 불필요한 감탄사 없이 담백하게

## 다이어그램: Mermaid 사용법

차트, ERD, 시퀀스, 플로우차트 등 **구조적 다이어그램은 ASCII 아트 대신 Mermaid를 쓴다.**
(ASCII 박스는 웹 폰트에서 문자 폭이 달라 정렬이 깨진다. 블로그는 Mermaid를 지원한다.)

**두 가지만 지키면 된다:**

1. 프론트매터에 `mermaid: true` 추가 — 이게 있어야 그 글에서만 mermaid.js를 로드한다.
2. 본문에서 ` ```mermaid ` 펜스가 아니라 **`<pre class="mermaid">` raw HTML 블록**으로 작성:

```html
<pre class="mermaid">
erDiagram
    EMPLOYEE ||--o{ ORDER : "주문 (1:N)"
    EMPLOYEE {
        int    Id    PK
        string Name
    }
</pre>
```

**주의사항:**
- `<pre class="mermaid">`는 **열 0(들여쓰기 없이)**, 앞뒤로 빈 줄. **블록 내부에는 빈 줄 금지** (kramdown이 HTML 블록을 끊는다).
- 블록 안에 **`<` 문자 금지.** 라벨 줄바꿈용 `<br/>`를 쓰지 말고 라벨은 한 줄로. (`-->`, `->>`처럼 `>`만 있는 건 OK — kramdown이 `&gt;`로 이스케이프해도 브라우저 `textContent`에서 `>`로 디코드된다.)
- 검증된 타입: `flowchart`, `erDiagram`, `sequenceDiagram` (그 외 mermaid 타입도 대부분 동작).
- 문법 검증(선택): node로 `mermaid.parse()`를 돌리면 게시 전 오류를 잡을 수 있다.

**렌더 설정(이미 되어 있음, 손댈 일 없음):** `_layouts/default.html`이 `page.mermaid`일 때만 jsDelivr에서 `mermaid@11`을 로드하고, `assets/css/main.css`의 `.post-content pre.mermaid`가 렌더 전 숨김·가운데 정렬·가로 스크롤을 처리한다.

## 포스트 게시 워크플로우

포스트 작성 요청을 받으면 다음을 순서대로 자동 처리:

1. `_posts/` 에 파일 생성
2. `git add <파일>` → `git commit` → `git push origin main`

**별도 브랜치 불필요. main 직접 사용.**
커밋 후 푸시까지 완료해야 작업 종료. 중간에 확인 요청하지 말 것.

## 기존 포스트와 중복 주의

새 글 작성 전 `_posts/` 목록을 확인해서 유사 주제 글이 있으면 차별화 포인트를 잡아 작성.
