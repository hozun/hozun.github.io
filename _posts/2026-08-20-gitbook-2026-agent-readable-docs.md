---
layout: post
title: "GitBook 2026: 문서 도구가 아니라 에이전트가 읽는 표면"
date: 2026-08-20 17:00:00 +0900
tags: [개발, 인공지능, 리뷰]
mermaid: true
description: "GitBook 자체 조사에서 AI 에이전트가 문서 독자의 과반(51.8%)을 넘었다. 모든 사이트에 MCP 서버와 llms.txt가 기본으로 붙는 지금, 이 도구를 어디에 쓰고 어디에 쓰지 말아야 하는지 정리했다."
---

GitBook을 "예쁜 문서 호스팅"으로 기억하고 있다면 업데이트가 필요하다. 2026년의 GitBook에서 가장 중요한 변화는 편집기도 가격도 아니고, **모든 게시 사이트에 MCP 서버와 llms.txt가 자동으로 붙는다**는 점이다.

결론부터.

- GitBook 자체 조사 기준, 크롤러를 제외한 의도적 읽기에서 **AI 에이전트가 51.8%로 사람(48.2%)을 넘었다.**
- 그래서 이 도구의 실질 가치는 편집 경험이 아니라 **에이전트에게 노출되는 표면**에 있다. 무설정으로 `llms.txt`, 페이지별 `.md`, `/~gitbook/mcp`가 생긴다.
- 결정을 지배하는 건 **사이트당 + 유저당 이중 과금**이다. 제품이 셋이면 사이트도 셋이 되기 쉽다.
- **온프레미스 옵션이 없다.** 폐쇄망·규제 환경에서는 후보에서 빠진다.

먼저 밝혀둘 것. 아래 가격 수치는 공식 페이지가 아니라 서드파티 가격 추적 사이트와 검색 결과에서 모았다. 계약 전에는 공식 가격 페이지를 직접 확인해야 한다.

---

## 1. 독자가 바뀌었다

GitBook이 자사 호스팅 문서 사이트의 트래픽을 분석해 2026년 4월 공개한 수치다. 크롤러를 걷어내고 **의도적 읽기(intentional reads)** 만 남겼을 때의 비율이다.

| 시점 | AI 비중 |
|---|---|
| 2025년 1월 | 10% 미만 |
| 2025년 12월 | 약 41% |
| 2026년 4~5월 | **51.8%** (사람 48.2%) |

벤더 자체 데이터이므로 절대 수치는 유보해야 한다. 다만 방향성은 Mintlify가 2026년 3월 발표한 에이전트 트래픽 조사와도 일치한다. **문서의 1차 독자가 사람에서 에이전트로 넘어가는 중**이라는 게 이 카테고리 전체의 전제가 됐다.

이 전제를 받아들이면 문서 도구의 평가 기준이 바뀐다. "얼마나 읽기 좋은가"가 아니라 "얼마나 파싱하기 좋은가"가 앞으로 온다.

---

## 2. 그래서 GitBook이 기본으로 주는 것

<pre class="mermaid">
flowchart LR
    D["GitBook 게시 사이트"] --> H["HTML · 사람"]
    D --> L["llms.txt / llms-full.txt"]
    D --> M["페이지별 .md · URL 뒤에 .md"]
    D --> P["MCP 서버 · /~gitbook/mcp"]
    L --> A["AI 에이전트"]
    M --> A
    P --> A
</pre>

| 기능 | 내용 |
|---|---|
| **llms.txt / llms-full.txt** | 무설정 자동 생성 (2025년 1월부터) |
| **`.md` 접미사** | 모든 페이지 URL 뒤에 `.md`를 붙이면 원문 마크다운. 에이전트가 HTML을 파싱할 필요가 없다 |
| **MCP 서버 자동 노출** | 문서 루트에 `/~gitbook/mcp`. **사이트마다 자동, 설정 불필요** |
| **`<llms-only>` / `<llms-ignore>`** | AI에게만 보이는 블록 / AI에게 숨기는 블록 |
| **AI 트래픽 분석** | LLM 제공자별 유입 통계 |
| **Git Sync** | GitHub·GitLab 양방향 동기화. **무료 플랜 포함** |
| **Adaptive content** | 방문자 claim(역할·플랜·지역)에 따라 페이지·블록을 동적 분기 (Ultimate) |

MCP 자동 노출이 특히 크다. 문서를 올리기만 하면 Claude Code 같은 에이전트가 그 문서를 도구로 붙일 수 있는 상태가 된다. [OKF 글](/2026/07/14/google-open-knowledge-format-okf/)에서 다룬 "에이전트에게 지식을 넘겨주는 표준" 문제를, GitBook은 포맷 논쟁에 참여하는 대신 **플랫폼 기본값으로** 처리하는 쪽을 택했다.

`<llms-only>` / `<llms-ignore>` 태그도 눈여겨볼 만하다. 같은 문서 안에서 **사람용 서술과 에이전트용 구조화된 사실을 분리**할 수 있다는 뜻이고, 이건 [LLM Wiki 패턴](/2026/08/03/llm-wiki-pattern/)이 미결로 남겨둔 지점이기도 하다.

---

## 3. 가격 — 여기가 의사결정을 지배한다

| 플랜 | 가격 | 주요 내용 |
|---|---|---|
| Free | $0 | **1인**, gitbook.io 서브도메인, Agent 주 10메시지, 커스터마이징 최소 |
| Premium | **$65/사이트/월** + $12/유저/월 | 커스텀 도메인, Agent 무제한, AI 검색, 검색 분석 |
| Ultimate | **$249/사이트/월** + $12/유저/월 | AI Assistant(성공 답변 500건 소프트리밋), adaptive content, 커스텀 폰트 |
| Enterprise | 별도 | SAML SSO 등 |

핵심은 **사이트당 + 유저당 이중 과금**이다.

- 5인 팀이 Premium 하나면 $65가 아니라 **$113/월** ($65 + $12×4)
- 제품이 3개면 사이트도 3개가 되기 쉽다. 여기서 견적이 튄다

리뷰에서 가장 많이 나오는 불만이 이 구조 전환이다. 사이트 기본요금 모델로 바뀌면서 프로젝트가 여럿이고 인원이 많은 팀은 2~3배 인상을 겪었다는 보고가 반복된다.

반대로 **무료 플랜에도 Git Sync, 버전 이력, MCP 서버, llms.txt가 다 들어간다.** 개인 실험은 끝까지 공짜로 해볼 수 있다는 뜻이고, 이게 실제로는 가장 중요한 정보다.

---

## 4. 잘 되는 것과 안 되는 것

### 잘 되는 것

- **공개 개발자 문서 / API 레퍼런스** — OpenAPI 렌더링, 인터랙티브 플레이그라운드, PR 프리뷰. 가장 검증된 영역
- **비개발자가 섞인 문서 팀** — PM·테크라이터가 코드 에디터를 열지 않고 구조와 내비게이션을 바꿀 수 있다. Mintlify·Docusaurus 대비 명확한 차별점
- **에이전트에게 물려줄 지식 표면** — 직접 구현하면 몇 주 걸릴 걸 기본값으로 받는다
- **제품별·플랜별로 다른 문서** — adaptive content로 페이지 복제 없이 분기

### 안 되는 것

| 문제 | 내용 |
|---|---|
| **온프레미스 불가** | 공식 self-host 없음. 클라우드 전용. 렌더링 프론트엔드만 오픈소스로 셀프호스팅 가능한 수준 |
| **코드 변경 → 문서 자동 갱신 부재** | Git Sync는 문서 파일 동기화이지, 코드가 바뀌었다고 문서를 고쳐주진 않는다. Agent 베타가 이 방향이긴 하다 |
| **안정성 불만** | 동기화 이슈, 느린 백엔드, 업데이트 후 깨짐, 편집기와 게시본의 서식 차이가 리뷰에 반복 등장 |
| **레이아웃 자유도** | 기본 디자인은 깔끔하지만 벗어나기 어렵다 |
| **모노레포 에셋 공유** | 여러 디렉토리 → 여러 space는 되지만, `packages/docs-en/.gitbook/assets/`의 파일이 `docs-fr` space에서 자동으로 보이지 않는다 |
| **지원 응답** | 느리다는 불만 다수 |

Git Sync를 쓸 때 실무적으로 걸리는 것 하나 더. **readme 파일은 GitBook UI에서 만들거나 고치지 말아야 한다.** 리포지토리에서만 관리해야 충돌과 중복이 안 생긴다. 개별 파일 크기 상한은 100MB다.

---

## 5. 어디에 쓸 것인가

<pre class="mermaid">
flowchart TD
    A["문서를 어디에 둘까"] --> B{"폐쇄망 또는 데이터 반출 제약?"}
    B -- Yes --> C["Wiki.js / BookStack / MkDocs 자체 호스팅"]
    B -- No --> D{"에이전트가 읽는 게 목적?"}
    D -- No --> E{"레이아웃을 직접 통제하고 싶다?"}
    E -- Yes --> F["Docusaurus / 정적 사이트 생성기"]
    E -- No --> G["GitBook 또는 Mintlify"]
    D -- Yes --> H{"사이트 몇 개가 될 것인가"}
    H -- "1~2개" --> I["GitBook · MCP와 llms.txt를 기본값으로"]
    H -- "여러 개" --> J["과금 구조 먼저 계산 · 자체 구축 비교"]
</pre>

**추천되는 자리**

- **에이전트용 지식 베이스 실험.** 무료 플랜이 1인 + MCP + llms.txt를 다 준다. LLM Wiki 패턴을 실제로 한 바퀴 돌려보는 최소 비용 실험대다. [4개월 회고 글](/2026/08/14/llm-wiki-four-months-no-references/)에서 "도구는 성숙했는데 레퍼런스가 없다"고 썼는데, 이 조합이 그 공백을 메우기 가장 쉬운 지점이다
- **SDD 스펙 배포 계층.** spec-kit 산출물은 결국 리포지토리 안 마크다운이다. Git Sync를 걸면 [스펙이 곧 게시 문서](/2026/07/22/sdd-lowcode-spec-to-build/)가 되고 동시에 MCP로 에이전트에 노출된다. "스펙이 계약이 된다"는 주장에 배포 채널이 붙는다
- **사내 개발 가이드** — 조건부. 규약·절차 문서는 스윗스팟이지만, 비공개 운영은 상위 플랜이 필요하고 팀별로 사이트를 쪼개면 금방 비싸진다

**빠져야 하는 자리**

- **폐쇄망·규제 환경.** [이 유형의 요구](/2026/05/22/closed-network-mobile-access-architecture/)에는 애초에 후보가 아니다. 온프레미스가 없다
- **빌드 산출물형 문서.** [전사 용어사전](/2026/08/20/enterprise-data-dictionary-saas/) 같은 건 `canonical.yaml → build.py → 단일 HTML` 구조가 맞다. 검증 로직이 붙은 산출물이지 편집하는 문서가 아니고, 갭 리포트나 커버리지 게이지처럼 데이터에서 계산되는 UI가 핵심이기 때문이다. GitBook은 그 옆에서 **개념 정의와 의사결정 기록**을 담는 정도로만
- **개인 블로그.** 정적 사이트 생성기로 이미 돌아가고 있다면 옮길 이유가 없다

---

## 6. 시작한다면 이 순서

1. 무료 플랜으로 리포지토리 하나를 **Git Sync**
2. 게시 후 **`<사이트주소>/~gitbook/mcp`를 에이전트에 MCP 서버로 붙여본다.** 이게 쓸 만한지가 도입 판단의 8할이다
3. `.md` 접미사와 `llms-full.txt`가 뭘 뱉는지 직접 확인한다. 내 문서가 에이전트에게 어떻게 보이는지 감이 잡힌다
4. 유료 검토는 **"사이트가 몇 개가 될 것인가"를 먼저 세고** 시작한다

---

## 정리

도구로서의 GitBook보다, **GitBook이 기본값으로 만들어버린 것**이 더 중요한 신호다. 모든 문서 사이트에 MCP 서버와 llms.txt가 자동으로 붙는다는 건, 문서를 "쓰는 일"과 "에이전트에 공급하는 일"의 경계가 사라지고 있다는 뜻이다.

편집 경험이나 가격만 보고 이 도구를 평가하면 정작 중요한 걸 놓친다. 판단 기준은 하나로 좁혀도 된다. **내 문서를 에이전트가 읽어야 하는가.** 그렇다면 무료 플랜으로 한 바퀴 돌려볼 값은 충분하고, 아니라면 굳이 사이트당 $65를 낼 이유가 없다.

---

## 참고

- [Research: AI agents are now the majority reader of your docs](https://www.gitbook.com/blog/ai-docs-data-april-2026) — GitBook Blog (2026.04)
- [Supporting AI standards at GitBook: What OKF, MCP and llms.txt tell us](https://www.gitbook.com/blog/supporting-ai-standards-gitbook) — GitBook Blog
- [LLM-ready docs](https://gitbook.com/docs/ai-and-search/llm-ready-docs) · [Adaptive content](https://gitbook.com/docs/publish/adaptive-content) · [Monorepos](https://docs.gitbook.com/integrations/git-sync/monorepos) — GitBook Documentation
- [The state of agent traffic in documentation](https://www.mintlify.com/blog/state-of-ai) — Mintlify (2026.03)
- [GitBook Pricing 2026](https://www.happysupport.ai/en/blog/gitbook-pricing) — happysupport.ai · [GitBook Pricing 2026: Hidden Fees](https://ferndesk.com/blog/gitbook-pricing) · [GitBook Review 2026](https://ferndesk.com/blog/gitbook-review) — Ferndesk
- [Mintlify vs GitBook vs Docusaurus vs ReadMe: 2026 Comparison](https://www.devtoolreviews.com/reviews/mintlify-vs-gitbook-vs-docusaurus-vs-readme-2026) — DevToolReviews
- [GitLab-integrated API documentation platforms for self-hosted enterprises](https://buildwithfern.com/post/gitlab-api-documentation-platforms-self-hosted) — Fern
- [GitBook Reviews](https://www.g2.com/products/gitbook/reviews) — G2
