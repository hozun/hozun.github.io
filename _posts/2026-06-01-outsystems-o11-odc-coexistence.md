---
layout: post
title: "O11과 ODC 병행 운영 아키텍처 기술 검토"
date: 2026-06-01 13:20:00 +0900
tags: [로우코드, 기업IT, 개발]
description: "O11을 System of Record로 유지하면서 ODC를 경험·AI·워크플로 확장 레이어로 붙이는 병행 운영 모델. Data Fabric 읽기 연합, O11 API 쓰기-백, CDC 투영까지 공식 문서 기반 설계안과 리스크를 정리한다."
---

OutSystems의 현재 공식 방향성은 **O11을 즉시 대체하는 빅뱅 전환**이 아니다. O11을 유지·확장하면서 ODC의 클라우드 네이티브·AI 기능을 **병행 활용**하는 상호운용 모델에 가깝다. OutSystems는 O11의 수명을 "indefinitely" 연장하겠다고 공식적으로 밝혔고, 기존 O11 고객이 ODC의 AI 기능을 쓸 수 있도록 **데이터·로직 상호운용성**을 지원하겠다고 약속했다. ODC Data Fabric Connector for O11이 공개되었고 이후 **multi-pipeline 아키텍처 지원**도 추가됐다. 따라서 기존 O11 포트폴리오가 큰 조직일수록 "전면 재구축"보다 **장기 병행 운영 + 점진적 이동**이 기술·운영 리스크를 더 낮춘다.

핵심 결론부터 말하면, 병행 운영의 성공 여부는 "연결 가능하냐"가 아니라 **무엇을 어느 플랫폼이 소유하느냐**에 달려 있다. 공식 문서가 제공하는 기능은 충분하지만, 설계 원칙을 잘못 잡으면 ODC의 자동 확장성과 O11의 안정성을 동시에 잃는다. 기본 원칙은 단순하다. **O11은 System of Record로 유지**, ODC는 **신규 UX·외부 채널·AI/agent·워크플로 오케스트레이션·고변화 프런트엔드**를 담당한다.

---

## 공식 문서가 정한 경계

공식 문서 기준으로 ODC는 O11 데이터베이스의 엔터티를 **Data Fabric**으로 직접 소비할 수 있고, 이 연결에는 **Private Gateway**가 사용된다. 다만 제약이 분명하다.

- **공개된 Public 엔터티만** ODC에 노출 가능하다.
- O11에서 **read-only로 노출된 엔터티는 ODC에서 변경할 수 없다.**
- ODC가 O11 데이터를 소비하는 앱의 확장성은 결국 **기저 O11 DB의 성능과 용량**에 좌우된다.
- 연결 자체는 **일회성(one-time) 기반 설정**으로 설계됐지만, 그 위에서 동작하는 버전 정합성·권한·관측성은 별개 과제다.

핵심 인용을 표로 정리하면 다음과 같다.

| 핵심 문구 | 해석 |
|---|---|
| "extending its life indefinitely" | O11은 단기 퇴출 대상이 아니라 병행 운영 가능한 장기 플랫폼 |
| "maintain and evolve your core apps on O11" | 코어 앱은 O11에 두고 ODC를 확장 레이어로 붙이는 전략을 공식 권장 |
| "directly consume entities residing in O11 databases" | ODC는 O11 DB 엔터티를 Data Fabric으로 직접 소비 가능 |
| "Only public entities can be exposed to ODC" | O11 데이터 재사용은 무제한이 아니라 Public 엔터티로 제한 |
| "depends on the performance and capacity" | ODC가 읽더라도 성능 하한선은 O11 DB가 결정 |
| "Service Studio 11.55.59.64640 or later" | 병행 운영은 기능보다 **버전 정합성**이 먼저 |
| "trigger existing O11 business processes" | ODC는 O11의 기존 프로세스·검증·통합 로직을 호출하는 확장자로 적합 |

OutSystems 공식 Learn 여정도 같은 순서를 강조한다. O11→ODC는 "주요 차이점 이해"가 선행 과제이고, Private Gateway는 사설 네트워크 안전장치이며, **인증·인가 재설계**와 **사전 준비**가 별도 여정으로 분리되어 있다.

---

## 비교 분석과 리스크 우선순위

아래 표는 O11과 ODC의 차이, 병행 운영 시 함의, 주요 리스크와 완화 방안을 압축한 것이다. 우선순위는 **P1 즉시 통제 / P2 파일럿 이전 통제 / P3 최적화 단계 통제**로 해석한다.

| 항목 | O11 | ODC | 병행 운영 시 판단 | 리스크와 완화 |
|---|---|---|---|---|
| 아키텍처 | LifeTime/Service Center 중심 VM·모듈·환경 관리 | 앱·라이브러리·Identity Service·Data Platform·격리 K8s 클러스터 | 공유 플랫폼이 아니라 **서로 다른 운영 모델의 연결** | **P1 도메인 경계 불명확** → 앱별 소유 도메인 맵, weak dependency/API 경계 강제 |
| 배포 모델 | public/private/hybrid, self-managed 가능 | SaaS 기본, self-hosted는 고객 OpenShift/PostgreSQL | 환경 수가 같아 보여도 운영 책임 경계가 다름 | **P2 stage 매핑 오류** → Dev/Test/Prod ↔ ODC stage 1:1 표준화 |
| 데이터 흐름 | LifeTime에서 엔터티 노출 | Data Fabric 읽기 + Private Gateway 사설 연결 | 실시간 **읽기 연합**은 강하게 지원, **대칭 양방향 쓰기는 비공식** | **P1 이중 쓰기·드리프트** → O11 단일 writer, ODC는 읽기 연합 + API 쓰기-백 |
| API·통합 | REST/Service Action, SOA 추상화 성숙 | REST API, 이벤트 기반 아키텍처, 약결합 | **조회=Data Fabric, 명령=API, 확산=이벤트** 삼분 구조 | **P1 chatty 호출·로직 중복** → coarse-grained API, 검증 로직 단일화 |
| 인증·인가 | IT user RBAC, 기존 SSO | Identity Service 내장 IdP, 외부 IdP, OIDC/OAuth 2.0 | **중앙 IdP 수렴**이 핵심 | **P1 권한 이원화** → 외부 IdP 중심 통합, O11 브리지는 임시 패턴만 |
| 장애·모니터링 | HA, XRDR, audit log, log streaming | optional multi-AZ HA, 4주 로그·트레이스, APM/SIEM, immutable audit | 문제는 기능 부재가 아니라 **관측성 분절** | **P1 분산 장애 분석 실패** → 공통 correlation ID, 중앙 APM/SIEM, SLO 통합 |
| 성능·확장성 | 프런트엔드 farm + DB 증설 | replica 자동 수평 확장, DB 용량 자동 조정 | ODC 프런트는 늘어도 실시간 읽기 순간 병목은 O11 DB로 회귀 | **P1 O11 DB 병목** → 읽기 캐시/투영 분리, 고빈도는 CDC, SQL 튜닝 |
| 운영비용 | 라이선스·환경·HA/DR/로그 add-on | edition/AO/users/add-on, Subscription Console | **기술 복잡도보다 비용·거버넌스 복잡도**가 먼저 증가 | **P2 AO·add-on 비용 팽창** → AO 예산화, 분기별 사용량 리뷰 |
| CI/CD | LifeTime, Deployment Plans, outsystems-pipeline | publish→release→deploy 분리, REST API로 Jenkins/Azure DevOps | 릴리스 개념이 달라 공통 Git 정책만으론 부족 | **P2 잘못된 버전 배포** → 플랫폼별 파이프라인 템플릿, freeze window |
| 버전 관리 | strong/weak dependency, 업그레이드 영향 큼 | 라이브러리 독립 lifecycle, 상호운용 최소 버전 요구 | "기능 준비"보다 **기반 버전 정렬**이 선행 | **P1 버전 스큐** → O11 baseline 업그레이드 선행, smoke test 자동화 |

---

## 데이터 상호운용성 설계안

데이터 상호운용성의 출발점은 **O11 엔터티 노출 → ODC Portal에서 O11 연결 구성 → ODC Studio에서 외부 엔터티 소비**다. Private Gateway가 보안 경로를 제공한다. 이 구조는 **실시간 읽기 연합(read federation)** 에 최적화되어 있다.

가장 피해야 할 구조는 **ODC와 O11이 같은 비즈니스 레코드를 동시에 직접 수정하는 것**이다. 공식 문서는 read-only 노출 제약을 두고 있고, ODC 이벤트 아키텍처는 느슨한 결합과 비동기 처리를 전제한다. 따라서 교차 플랫폼 쓰기는 **O11 API로 수렴**시키고, ODC는 **명령 발행자이자 투영 소비자**로 둔다.

### 데이터 군별 소유권

| 데이터 군 | 권장 소유 | ODC 소비 방식 | 쓰기 경로 | 일관성 전략 |
|---|---|---|---|---|
| 기준정보·마스터 | O11 | Data Fabric read-through | O11 백오피스/API만 | **O11 단일 진실원천**, 고빈도 조회는 캐시/투영 |
| 핵심 트랜잭션 | O11 | Data Fabric 조회 또는 파사드 API | O11 REST/Service Action 래퍼 | 명령은 O11 트랜잭션으로 수렴, ODC는 재조회/이벤트 |
| ODC 전용 경험 데이터 | ODC | ODC 자체 엔터티 | ODC 자체 트랜잭션 | 세션·임시 상태는 ODC 소유, O11 ID만 참조키 |
| 검색·분석·오프라인 투영 | ODC | CDC/배치로 적재한 read model | 원천 직접 수정 금지 | **eventual consistency**, 멱등 처리 + source event ID 중복 제거 |
| 사용자·권한 컨텍스트 | 외부 IdP (전환기 O11 브리지) | ODC 그룹/claim mapping | IdP 또는 전환기 브리지 | 데이터 동기화보다 **인증 연합**, 사용자를 도메인 데이터처럼 다루지 말 것 |
| O11 static entity | 보통 O11 | 외부 엔터티로 읽음 | 직접 수정 비권장 | 라벨/정적 의미 중요 시 ODC static entity로 재모델링 |

데이터 타입 매핑에서는 설계 시점에 최소한 **식별자 타입, 시간대(DateTime), 정밀도(Decimal), nullable 컬럼 처리, 문자열 길이**를 명시적으로 검증해야 한다. O11과 ODC 모두 의미는 같아 보여도 외부 엔터티/SQL 처리에서 **nullable 해석 차이**가 장애를 만든다.

트랜잭션 일관성에 대해 공식 문서는 O11-ODC 사이에 **분산 트랜잭션 코디네이터를 제공하지 않는다.** 따라서 **2PC를 전제하지 말고** 교차 플랫폼 업무는 **Saga / Outbox / Idempotent Consumer** 패턴으로 설계한다.

### 동기화 도구 비교

| 패턴 | 지연 | 권장 사용처 | 주의점 |
|---|---|---|---|
| Data Fabric read-through | 실시간 | 기준정보, 고객 360 조회 | O11 DB 병목 종속, 쓰기 경로 아님 |
| O11 REST/Service API write-back | 동기 | 상태 변경, 승인, 검증 | 재시도·멱등성 설계 필요 |
| CDC | 준실시간 | 검색 인덱스, 분석, 조회 부하 분산 | latency spike·재동기화 운영 |
| 메시지 큐 | 비동기 | 후속 처리, 알림, 투영, Saga | at-least-once 전제, 순서/중복 제어 |
| 배치 타이머 | 분·시간 | 저빈도 동기화, 정산, 대사 | 최신성 낮음, 배치 윈도 관리 |

### 권장 기본형 (조회=연합, 쓰기=O11 수렴, 후속=비동기)

```
[조회 흐름]
End User → ODC App → Data Fabric → Private Gateway → O11 DB Views
                                                          │
End User ← ODC App ← Normalized ← Private Gateway ← Result set

[쓰기 흐름]
End User → ODC App ──Command API──→ O11 REST/Service API
                                          │ Validate + Commit
                                          ▼
                                       O11 DB
End User ← ODC App ←────200 OK────── O11 API
              │
              └─Emit event─→ Event Queue ─→ (async) 투영/캐시 갱신
```

이 형태가 가장 단순하면서 공식 문서의 지원 범위와 가장 잘 맞는다.

---

## 권장 아키텍처 옵션

| 옵션 | 권장 상황 | 장점 | 단점 | 운영 복잡도 |
|---|---|---|---|---|
| **① Data Fabric 읽기 연합 + O11 API 쓰기-백** | 코어는 O11에 두고 ODC로 신규 UX/AI를 빠르게 붙일 때 | 공식 기능과 가장 정합적, 빠른 PoC, 데이터 이관 최소 | O11 DB 병목 가능, 쓰기는 별도 API | 중간 |
| **② API-first strangler** | DB 직접 결합을 줄이고 계약 중심 경계를 원할 때 | DB 결합 최소, 테스트/권한/버전 명확, 미래 이전 용이 | API 개발량 증가, 조회 성능이 API 설계 품질에 종속 | 중간~높음 |
| **③ CDC + 이벤트 기반 ODC 투영 저장소** | 읽기 트래픽 크고 검색·오프라인·분석·대외 포털처럼 ODC 독립 확장이 중요할 때 | O11 DB 부하 완화, ODC 독립 확장 | eventual consistency 수용, 운영 구성요소 증가 | 높음 |

**기본 권고안은 ①번이다.** 공식 문서가 직접 지원하는 기능 집합과 가장 잘 맞고, 데이터 이동량이 최소이며, 초기 조직 저항도 적다. ②번은 장기적으로 더 깔끔하지만 초기 개발량이 많고, ③번은 규모·성능에 가장 좋지만 운영 난도가 가파르게 오른다.

> 비용은 공개 가격표 기준 **하한선**으로만 본다. OutSystems 공식 가격은 조직 규모·환경 수·사용자 수·컴퓨트에 따라 달라진다. 공개치 기준 가장 보수적인 병행 운영 하한은 기존 O11 Enterprise + ODC 기본 구성 동시 유지 시 대략 **GBP 53,000/년** 수준이고, ODC에 HA를 붙이면 약 **GBP 66,000/년** 수준이다. 이는 **1 AO pack 수준의 공개 하한치**일 뿐 계약 견적이 아니다. 실제 비용은 사용자 수, AO, Private Gateway, HA/Sentry, 추가 non-prod에 따라 달라진다.

---

## 보안·컴플라이언스

- **데이터 주권**: ODC Data Platform은 지정 리전에서 동작하고 서울 리전도 제공한다. 더 강한 통제가 필요하면 **ODC Self-hosted**가 대안이지만 고객이 OpenShift·PostgreSQL 운영 책임을 상당 부분 진다. 규제 때문에 선택할 수는 있어도 일반 병행 운영의 기본값으로 두기엔 부담이 크다.
- **암호화·감사**: ODC는 로그·트레이스를 TLS 전송 + AES-256 저장으로 보호하고 Audit Trail을 불변 기록으로 유지하며 SIEM 스트리밍을 지원한다. O11도 IT 사용자 작업 audit log와 log streaming을 제공한다. 병행 운영에서는 두 플랫폼 감사를 따로 보지 말고 **공통 SIEM 스키마와 보존 정책**을 먼저 정해야 한다.
- **네트워크**: Private Gateway + ODC public IP allowlist + 앱 IP filter + 외부 IdP egress allowlist 조합이 정석이다. 연결점이 많아지므로 "어느 방향 트래픽을 누가 허용했는지"를 표준화하지 않으면 운영 중 403/404/timeout이 반복된다.

---

## 병행 운영 체크리스트

병행 운영은 "개발 전 준비" 비중이 높다. 공식 문서도 변환 준비와 아키텍처 평가를 별도 여정과 Conversion Kit로 분리한다. 즉 옮길지 만들지보다 **무엇을 남기고 무엇을 연결할지**를 먼저 결정한다.

| 단계 | 필수 확인 | 게이트 |
|---|---|---|
| 탐색 | O11 앱 분류, 도메인 경계, 외부 연동 목록, 성능 hotspot | 유지/확장/전환 후보 구분 완료 |
| 기반 정렬 | Platform Server·LifeTime·Service Studio·ODC Studio 최소 버전 | 공식 최소 버전 검증 완료 |
| 보안 정렬 | 중앙 IdP, 그룹 매핑, secret rotation, network allowlist | Dev stage 로그인·토큰 흐름 검증 |
| 파일럿 | Data Fabric 연결, 핵심 조회 1~2개, 쓰기 API 1개, 관측성 | 기능·성능·권한 smoke test 통과 |
| 경화 | 캐시/투영 식별, 멱등성, 재시도, DLQ, 장애 drill | 장애 복구 리허설 완료 |
| 확장 | multi-pipeline, 추가 도메인, 비용 가드레일, CI/CD | 운영/CAB 승인 완료 |

### 테스트 전략

테스트는 **통합·회귀·부하·관측성** 네 축이다. 병행 운영에서는 "기능이 되는가"보다 **계약이 유지되는가, 권한이 맞는가, O11 DB가 버티는가**가 더 중요하다.

| 종류 | 중점 검증 |
|---|---|
| 통합 | ODC→Data Fabric 조회, ODC→O11 API 명령, 재시도/에러코드, 권한 부족/만료 토큰 |
| 회귀 | 핵심 여정, 기준정보·상태변경 화면, role/group mapping, 라이브러리 버전 변경 영향 |
| 부하 | ODC 자동 확장 구간, O11 DB 조회 병목, API rate, queue backlog, CDC lag |
| 관측성 | correlation ID 전달, 로그/트레이스/SIEM 일관성, 경보 임계값, 감사 누락 |

실무적으로는 **파일럿 기간에 성능 테스트를 가장 앞당겨야 한다.** 공식 문서가 이미 "ODC 앱의 확장성은 O11 DB 성능에 좌우된다"고 경고하므로, 첫 파일럿에서 병목을 보지 않고 기능 검증만 끝내면 이후 설계가 왜곡된다.

---

## 결론과 실행 로드맵

**O11과 ODC 병행 운영은 충분히 성립 가능**하며 공식 문서·제품 업데이트가 이를 적극 뒷받침한다. 성공 조건은 "연결 기능 사용"이 아니라 **소유권과 쓰기 경로를 엄격히 통제**하는 데 있다. 기술적 관건은 커넥터가 아니라 **데이터 소유권, 권한 연합, 성능 분리, 관측성 통합**이다.

우선순위 권고 5가지:

1. **O11을 System of Record로 유지하고, ODC는 경험·AI·워크플로 확장 레이어로 시작하라.** 공식 문서가 가장 안정적으로 지원하는 모델이다.
2. **조회는 Data Fabric, 쓰기는 O11 API, 후속 반영은 이벤트**로 분리하라.
3. **상호운용 최소 버전과 stage 매핑을 착수 전에 고정하라.** 가장 값싼 리스크 제거책이다.
4. **중앙 IdP와 공통 SIEM/APM을 먼저 통합하라.** 권한 분열·장애 분석 실패를 가장 크게 줄인다.
5. **고부하 조회 도메인은 초기에 CDC/투영 후보로 분류하라.** O11 DB 병목은 후반이 아니라 초반에 드러내야 한다.

### 실행 로드맵

```
Q3 2026 ─ 기반 정렬
          · O11 baseline 업그레이드 + 호환성 정렬
          · 도메인 분류 + 데이터 소유권 확정
          · 중앙 IdP + 네트워크 정책 정의

Q4 2026 ─ 파일럿
          · Data Fabric + Private Gateway 연결
          · 핵심 조회 1~2개 + 쓰기 API 1개 구현
          · 공통 APM/SIEM + correlation ID 적용

Q1 2027 ─ 성능·투영
          · 고부하 도메인 성능 시험
          · CDC/이벤트 투영 대상 선정
          · CI/CD 템플릿 + 배포 게이트 표준화

Q2 2027 ─ 확장
          · 다중 도메인 확장
          · 비용 가드레일 + AO 운영 체계 정착
          · 운영 Runbook + DR Drill 정례화
```

이 로드맵의 목적은 "최대한 빨리 모두 옮기는 것"이 아니라 **안전한 병행 운영을 먼저 확립한 뒤 ODC가 실제로 더 유리한 도메인부터 넓혀 가는 것**이다. 공식 문서·제품 업데이트·교육 자료를 종합하면 이것이 가장 기술적으로 보수적이면서도 사업적으로 유연한 경로다.
