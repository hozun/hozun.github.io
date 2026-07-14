---
layout: post
title: "Google Open Knowledge Format(OKF): AI 에이전트에게 지식을 넘겨주는 마크다운 표준"
date: 2026-07-14 09:25:00 +0900
tags: [인공지능, 개발, 팁]
description: "OKF는 조직의 지식(테이블·지표·런북·API)을 마크다운 파일 묶음으로 표현하는 벤더 중립 오픈 규격. AI 에이전트가 내부 문서를 매번 다시 읽고 해석하지 않게 만드는 게 목적이다."
---

## 결론부터

**OKF(Open Knowledge Format)는 "조직이 아는 것"을 마크다운 파일 묶음으로 적어두는 오픈 규격이다.**

- 2026년 6월 Google Cloud가 v0.1로 공개했다. SDK도, 독점 계정도 필요 없다.
- 핵심 아이디어: 지표·테이블·데이터셋·API·런북 같은 지식을 **각각 하나의 마크다운 파일**로 적고, YAML 프론트매터로 최소한의 메타데이터만 붙인다.
- 목적은 **AI 에이전트가 흩어진 내부 문서를 매번 다시 읽고 해석하지 않게** 하는 것. 사람이 읽어도 되고 에이전트가 파싱해도 된다.
- 검색 랭킹 트릭이 아니다. Google도 "v0.1은 완성된 표준이 아니라 시작점"이라고 못 박았다.

이 글의 목적: 이미 위키·데이터 카탈로그를 써 본 사람이 OKF가 뭐가 다른지, 어디에 쓰면 좋은지, 어떻게 시작하는지 한 번에 잡는 것.

---

## 1. 무엇을 푸는 도구인가

AI 에이전트는 모델 밖에 있는 지식이 필요하다. 그런데 그 지식은 보통 이렇게 흩어져 있다.

- 데이터 카탈로그 (BigQuery, Snowflake…)
- 사내 위키 (Confluence, Notion…)
- 코드 주석, 리드미, 슬랙 스레드
- 장애 대응 런북, API 문서

에이전트를 하나 붙일 때마다 이 자료를 다시 긁어와 다시 해석해야 한다. 도구가 바뀌면 그 작업을 처음부터 반복한다.

OKF는 이 반복을 없애는 **공통 포맷**이다. 특정 클라우드·DB·모델·에이전트 프레임워크에 묶이지 않는다.

```
[기존]
각 에이전트 ──▶ 카탈로그·위키·코드·슬랙을 각자 다시 읽고 해석
   (도구 바뀔 때마다 반복)

[OKF]
지식 생산자 ──▶  OKF 번들(마크다운 묶음)  ──▶  아무 에이전트나 그대로 소비
                (한 번 정리, 여러 곳에서 재사용)
```

한마디로 **"지식을 코드처럼 버전 관리하고, 아무 에이전트나 읽을 수 있는 형태로 패키징"**하는 것이다.

---

## 2. 어떻게 생겼나

OKF 번들은 그냥 **마크다운 파일이 든 디렉터리**다. 개념(concept) 하나가 파일 하나이고, **파일 경로가 곧 그 개념의 식별자**다.

```
sales/
├── index.md
├── datasets/
│   ├── index.md
│   └── orders_db.md
├── tables/
│   ├── index.md
│   ├── orders.md
│   └── customers.md
└── metrics/
    ├── index.md
    └── weekly_active_users.md
```

각 파일 맨 위에는 YAML 프론트매터가 붙는다. **필수 필드는 `type` 하나뿐**이고 나머지는 선택이다.

```yaml
---
type: BigQuery Table
title: Orders
description: 완료된 고객 주문 1건당 1행.
resource: https://console.cloud.google.com/bigquery?p=acme&d=sales&t=orders
tags: [sales, revenue]
timestamp: 2026-05-28T14:30:00Z
---
```

| 필드 | 역할 | 필수 |
|------|------|------|
| `type` | 이 개념이 무엇인지 (테이블·지표·런북 등) | ✅ |
| `title` | 사람이 읽을 이름 | |
| `description` | 한 줄 설명 | |
| `resource` | 실제 리소스로 가는 링크(콘솔·URL) | |
| `tags` | 분류 태그 | |
| `timestamp` | 최종 갱신 시각 | |

개념끼리는 **평범한 마크다운 링크**로 연결한다. 이 링크들이 모여 파일시스템의 부모/자식 구조보다 풍부한 **관계 그래프**가 된다.

```markdown
| `customer_id` | STRING | [customers](/tables/customers.md) 테이블의 FK |

# 조인
[customers](/tables/customers.md) 와 `customer_id` 로 조인.
```

즉 새 문법을 배울 게 거의 없다. 마크다운 + 링크 + 최소 프론트매터가 전부다.

---

## 3. 활용하면 좋은 업무

'지식을 반복해서 에이전트에 먹여야 하는' 업무일수록 효과가 크다.

| 업무 | OKF로 하면 |
|------|-----------|
| **데이터 메타데이터 관리** | 테이블·컬럼·지표 정의를 "코드 옆 마크다운"으로 두고 버전 관리. 분석 에이전트가 스키마를 매번 추론 안 해도 됨 |
| **장애 대응 런북** | 온콜 에이전트가 읽을 수 있는 표준 런북. 사람도 그대로 읽음 |
| **사내 지표 정의(Metric layer)** | "주간 활성 사용자"가 정확히 무엇인지 한 파일에 확정 → 에이전트마다 다르게 계산하는 문제 방지 |
| **API/서비스 카탈로그** | 어떤 API가 뭘 하고 무엇과 연결되는지 그래프로 표현 |
| **팀 위키의 에이전트化** | 기존 위키를 에이전트가 소비 가능한 형태로 재구성 |
| **조직 간 지식 교환** | 벤더 중립이라 다른 조직·다른 에이전트에 그대로 넘겨도 해석됨 |

핵심 판단 기준: **"이 지식을 여러 에이전트/도구에 반복해서 넘기고 있는가?"** 그렇다면 OKF로 한 번 정리해 둘 값이 있다. 반대로 일회성 문서라면 굳이 규격을 얹을 필요는 없다.

---

## 4. 처음 시작하는 방법

OKF는 **생산자(producer)** 와 **소비자(consumer)** 를 분리해서 생각하는 게 핵심이다. 지식을 쓰는 쪽과 읽는 쪽이 서로 몰라도 된다.

시작 순서는 대략 이렇다.

1. **규격을 읽는다.** GitHub에 단일 페이지 스펙으로 공개돼 있다. `type` 하나만 필수라는 걸 확인하면 절반은 이해한 것.
2. **작은 번들을 손으로 만들어 본다.** 관리 중인 테이블 3~4개를 `tables/orders.md` 식으로 적고 프론트매터를 붙인다. 링크로 서로 연결한다.
3. **레퍼런스 구현을 돌려본다.** Google이 GitHub(`GoogleCloudPlatform/knowledge-catalog`)에 함께 공개한 것들:
   - **Enrichment 에이전트** — BigQuery 데이터셋을 순회하며 스키마·인용과 함께 OKF 문서를 자동 생성
   - **정적 HTML 시각화 도구** — 번들을 그래프로 인터랙티브하게 열람
   - **샘플 번들 3종** — GA4, Stack Overflow, Bitcoin 데이터셋
4. **소비자를 붙인다.** SDK가 없어도 된다. 파이썬으로 번들을 로드하고, YAML 프론트매터를 파싱하고, 마크다운 링크로 그래프를 만드는 수십 줄짜리 스크립트면 시작할 수 있다. 그 결과를 에이전트 컨텍스트로 넘기면 끝.

가장 빠른 체감 방법은 **샘플 번들을 시각화 도구로 열어보는 것**이다. "마크다운 파일 묶음이 어떻게 지식 그래프가 되는지"가 바로 보인다. 그다음 내 데이터로 enrichment 에이전트를 돌려 보면 감이 잡힌다.

---

## 정리

- OKF는 **조직의 지식을 마크다운 파일 묶음으로 표현하는 벤더 중립 오픈 규격**이다.
- 목적은 AI 에이전트가 흩어진 문서를 매번 다시 읽지 않게, **한 번 정리한 지식을 여러 곳에서 재사용**하게 만드는 것.
- 데이터 메타데이터, 지표 정의, 런북, API 카탈로그처럼 **반복해서 에이전트에 먹이는 지식**에 잘 맞는다.
- 시작은 간단하다. 스펙 한 페이지 읽고 → 작은 번들 손으로 만들고 → GitHub의 레퍼런스 구현/샘플로 확인.
- 단, **v0.1**이다. 표준이 굳어지는 중이니 지금은 "큰 인프라 투자"보다 "작게 시험해 보고 감 잡기"가 맞다.

---

**참고 링크**

- [How the Open Knowledge Format can improve data sharing — Google Cloud Blog](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing/)
- [Google Cloud Introduces Open Knowledge Format (OKF) — MarkTechPost](https://www.marktechpost.com/2026/06/16/google-cloud-introduces-open-knowledge-format-okf-a-vendor-neutral-markdown-spec-for-giving-ai-agents-curated-context/)
- [Google Cloud Announces The Open Knowledge Format — Search Engine Journal](https://www.searchenginejournal.com/google-cloud-announces-the-open-knowledge-format/579253/)
