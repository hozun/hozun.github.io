---
layout: post
title: "AI 에이전트와 로우코드, 2025년 기업 도입의 분기점"
date: 2026-04-27 10:00:00 +0900
tags: [인공지능, 기업IT, 로우코드]
description: "Gartner·McKinsey·Forrester 데이터로 본 AI Agent와 Low-Code 시장 수렴, TCO 비교, 거버넌스 전략, 그리고 한국 AI 기본법 대응 권고."
---

**2025년은 두 패러다임이 충돌이 아닌 융합으로 수렴한 해다.** Gartner가 2025년 7월 28일 발간한 Enterprise Low-Code Application Platforms Magic Quadrant에서 LCAP 정의 자체에 "generative AI"를 명시하고, "**2028년까지 글로벌 기업 80%가 엔터프라이즈 LCAP를 통해 Agentic AI를 구현할 것**"이라고 전망한 것이 결정적 신호다. 동시에 McKinsey의 State of AI 2025(n=1,993)에 따르면 기업의 **88%가 AI를 정기 사용**하지만 EBIT-수준 영향을 보고한 곳은 **39%**에 그쳐, 기술 도입과 가치 실현 사이에 큰 간극이 존재한다. 결국 CIO의 의사결정은 "AI Agent냐 Low-Code냐"가 아니라, **어떤 워크로드에 어떤 거버넌스를 입혀 두 접근을 결합할 것인가**의 문제로 이동했다. 이 보고서는 시장 데이터, 비용·역량·통합·보안의 다섯 축, 그리고 한국 시장의 특수성을 통해 그 답을 정리한다.

## 두 시장이 보내는 신호 — 규모와 채택률

**Low-Code 시장은 이미 30B 달러 규모의 성숙 카테고리이며, AI Agent는 폭발적 성장의 초입에 있다.** Gartner의 최신 전망은 Low-code development technologies 시장이 **2029년 $58.2B, CAGR 14.1%**에 이를 것으로 본다. 보다 광의의 정의를 사용하는 Forrester는 "**2028년까지 약 $50B에 근접**"한다고 추정했다. 도입률은 더 인상적이다. Gartner는 **2025년까지 신규 앱 70%가 low-code/no-code를 활용**하고 **2026년에는 시민 개발자 수가 전문 개발자를 4:1 비율로 압도**할 것으로 전망하며, Forrester 조사 기준 엔터프라이즈 개발자의 **87%가 이미 low-code를 사용 중**이다.

반면 AI Agent 시장은 출발점은 작지만 기울기가 가파르다. 조사기관별 정의 차이로 2025년 시장 규모 추정치는 $2.58B(Grand View Enterprise Agentic)부터 $7.84B(MarketsandMarkets AI Agents)까지 분산되지만, **CAGR은 일관되게 40~50% 구간**에 머문다. IDC는 글로벌 AI 솔루션 지출이 **2025년 $307B에서 2028년 $632B(CAGR 29%)** 로 성장하고, **2027년까지 G2000 기업의 agent 사용량은 10배, 토큰·API 콜은 1,000배 증가**한다고 본다. Gartner의 가장 자주 인용되는 두 수치는 "**2028년까지 일상 업무 의사결정의 15%가 agentic AI에 의해 자율 수행**(2024년 0%)"과 "**기업용 SW 애플리케이션의 33%가 agentic AI 포함**(2024년 1% 미만)"이다.

| 지표 | Low-Code | AI Agent (Agentic AI) |
|---|---|---|
| 2025년 시장 규모 | 약 $30~35B (Gartner/GM Insights) | $5~8B (조사기관별 편차) |
| 2028~2030 전망 | $50~58B | $47~93B |
| CAGR | 11~16% (Gartner 협의) ~ 22%(광의) | 40~50% |
| 도입률 | 엔터프라이즈 개발자 87%(Forrester), 신규 앱의 70%(Gartner) | 88% AI 사용 중, 23% agentic scaling, 39% 실험(McKinsey) |
| 시민 개발자 비중 | 4:1 초과(Gartner 2026) | 별도 통계 부재, 도구는 vibe coding으로 확장 |

개발자 도구 카테고리만 따로 보면 성장 속도는 사상 최단 기록을 갈아치우고 있다. **Cursor(Anysphere)는 2025년 1월 ARR $100M에서 2026년 2월 $2B**로 1년 만에 20배 성장했고 Series D에서 $29.3B 밸류를 인정받았다. **Claude Code는 2025년 9월 단독으로 $500M+ run-rate**를 발표했으며, **GitHub Copilot은 Fortune 100의 90%**가 도입했다. Stack Overflow 2025 조사에서 개발자 84%가 AI 도구를 사용 또는 사용 계획 중이고 51%가 일일 사용한다.

---

## 무엇이 새로 등장했는가 — 두 진영의 2024-2025 동향

**Low-Code 진영의 핵심 변화는 모든 리더 벤더가 AI 에이전트 빌더를 내장 기능으로 흡수했다는 점이다.** Gartner 2025 LCAP MQ의 6개 Leader(Mendix, OutSystems, Microsoft Power Platform, ServiceNow, Appian, Salesforce) 모두 자연어로 앱과 에이전트를 생성하는 기능을 출시했다. **Microsoft Copilot Studio**는 GPT-5 계열과 Anthropic 모델을 지원하며 1,400+ 시스템과 MCP로 연결된다. **OutSystems Mentor**(2025년 2월 GA)는 10개 이상의 AI 에이전트가 협업해 SDLC를 자동화하고, KPMG 사례에서 엔티티·스크린 작업의 40~50%를 자동화했다. **Mendix Maia**는 요구문서를 사용자 스토리·도메인 모델·페이지·마이크로플로로 자동 변환한다. **ServiceNow**는 Yokohama 릴리스(2025년 3월)와 ServiceNow LLM v2.0(2025년 10월)으로 사전 구성 AI Agent를 다수 출시했고, **Salesforce Agentforce 360**은 2025년 처음으로 Gartner LCAP MQ Leader에 진입하며 Q3 2025 기준 8,000개 유료 고객을 확보했다.

**AI Agent 진영에서는 자율성의 지평이 매월 확장되고 있다.** GitHub Copilot은 2025년 2월 Agent Mode, 9월 Coding Agent를 GA로 전환했고, Cursor는 자체 Composer 모델을 출시했다. Cognition은 2025년 7월 Windsurf를 인수해 Devin과 통합했으며, **Replit Agent 3는 최대 200분 자율 실행**이 가능하다. METR 추정에 따르면 **AI는 4개월마다 신뢰 가능한 작업 시간을 두 배로 늘리고** 있어, 2027년에는 4일 무감독 작업이 가능해질 것으로 예측된다. 동시에 **Anthropic의 Model Context Protocol(MCP)** 가 2024년 11월 발표 후 1년 만에 OpenAI(2025년 3월), Google DeepMind(4월), Microsoft(5월)에 채택되며 사실상 표준이 됐고, 12월에는 Linux Foundation 산하 Agentic AI Foundation에 기증됐다.

소비자급 vibe coding 도구도 엔터프라이즈 영역으로 진입 중이다. **Lovable**은 8개월 만에 ARR $200M에 도달하고 SOC 2 Type 2·ISO 27001 인증을 받았으며 Klarna·Uber·Zendesk가 사용한다. 그러나 업계 합의는 vibe coding이 **production 앱의 약 70%까지만 도달**하고, 인증·결제·복잡 비즈니스 로직 30%는 전통 개발이 필요하다는 점이다.

---

## 비용 구조의 결정적 차이 — TCO와 예측 가능성

**Low-Code의 비용은 계측 가능하고, AI Agent의 비용은 변동성이 핵심 리스크다.** Microsoft Power Apps Premium은 사용자당 $20/월, OutSystems ODC는 $36,300/년부터 시작하는 식으로 라이선스 모델이 단순하다. 반면 AI Agent는 토큰·메시지·credit 등 사용량 기반 과금이 중첩된다. **Microsoft Copilot Studio**는 25,000 Copilot Credits 팩이 $200/월이며 PAYG는 $0.01/credit이지만, BYOM Azure OpenAI 사용 시 일 10,000 interaction 워크로드는 약 **$23,000/월**까지 치솟는다. **Salesforce Agentforce는 18개월 동안 가격 모델을 세 차례 변경**해(대화당 $2 → $0.10/액션 Flex Credits → 사용자당 $550/월 Agentforce 1 Edition) 시장의 비판을 받았다. **Cursor도 2025년 7월 Pro $20 플랜의 500 요청 한도를 metered 모델로 변경했다가 사용자 반발로 일부 롤백**한 사례가 있다.

ROI 데이터는 두 진영 모두에서 풍부하지만 해석이 필요하다. Forrester TEI for Salesforce Agentforce Customer Service는 **3년 ROI 396%, NPV $2.2M**을, Field Service는 **3년 ROI 195%**를 보고했다(다만 Salesforce 의뢰 연구임에 유의). Microsoft Power Platform 사례에서는 Pacific Gas & Electric이 300개 솔루션으로 **연 $75M 절감**, Cineplex가 2년간 **30,000시간·$1M+ 절감**, Rabobank는 38개국 2,500+ 솔루션으로 처리 시간을 **3주에서 3분으로** 단축했다. McKinsey는 소프트웨어 엔지니어링·IT에서 **10~20% 비용 절감**, 마케팅·제품 개발에서 **10%+ 매출 상승** 효과를 보고했다.

그러나 가장 우려스러운 통계는 **Faros AI 2025의 "AI Productivity Paradox"** 다. 75% 개발자가 AI를 사용해 개인 PR이 98% 증가했지만 **버그가 9% 늘고 PR 사이즈가 154%, PR 리뷰 시간이 91% 증가**했다. METR의 무작위 대조 실험(2025년 7월, 16명 시니어 OSS 개발자)에서는 **AI 허용 그룹의 작업 완료 시간이 19% 증가**했다(개발자 자체 추정은 -20% 단축). AgilePoint 조사에서는 **42% 조직이 AI 이니셔티브를 포기**했다고 답했다.

---

## 역량, 통합, 거버넌스의 기업 관점 비교

**필요 역량의 분포가 다르다.** Low-Code는 시민 개발자(70%가 1개월 내 학습)를 중심으로 하되 거버넌스 팀(Center of Excellence)과 퓨전 팀이 필요하다. AI Agent는 프롬프트 엔지니어링, 명세 중심 개발(specification-driven), AgentOps, MCP 운영 같은 신생 역량을 요구하며 **EU AI Act는 2025년 2월 2일부터 AI 리터러시 교육을 법적 의무화**했다. McKinsey는 "고성능 기업은 디지털 예산의 20%+를 AI에 투자하고 시니어 리더의 ownership을 3배 이상 강조"한다고 분석한다.

**통합 측면에서 Low-Code는 커넥터 생태계, AI Agent는 MCP·A2A 같은 신규 프로토콜이 무기다.** Power Platform은 1,400+ 커넥터, Mendix Connect는 SAP·Salesforce·Siemens Teamcenter 카탈로그를 제공한다. AI Agent 진영에서는 **MCP 서버가 2025년 4월까지 5,800+개, 다운로드 8M+** 에 도달했고 ServiceNow AI Agent Fabric은 **A2A(Agent2Agent) 프로토콜**로 third-party agent까지 통합한다. 그러나 MCP의 보안 결함도 드러났다 — **CVE-2025-6514(mcp-remote)** 가 437,000개 환경에 영향을 미쳤고, prompt injection 공격의 학술 보고 평균 성공률은 **84.30%**에 이른다.

**보안·거버넌스의 격차는 극명하다.** Low-Code는 Managed Environments, DLP, Customer Lockbox, RBAC, FedRAMP 등 10여 년에 걸쳐 성숙한 통제를 갖췄다. AI Agent 거버넌스는 아직 미성숙하다 — Delinea 2025 조사에 따르면 **89% 기업이 AI 통제를 도입했으나 52%만 comprehensive control을 보유**하며, AI activity logging은 55%, identity governance for AI entities는 48%만 운영한다. 더 심각한 것은 **Microsoft Cyber Pulse Report 한국판이 보고한 "글로벌 80%+ 기업이 Low-code/No-code 도구로 활성 AI agent를 운영 중이지만 GenAI 보안 통제 도입은 47%"** 라는 격차다. **IBM Cost of Data Breach Report 2025**는 shadow AI 사고 시 평균 **+$670K** 추가 비용을 보고했다. Gartner는 **2030년까지 40%+ 기업이 unauthorized shadow AI 관련 사고를 경험**할 것으로 예측한다.

EU AI Act(2024년 8월 발효, 2026년 8월 고위험 AI 적용)와 **ISO/IEC 42001:2023**(AI 경영시스템 국제표준)이 글로벌 거버넌스 토대가 되고 있으며, ISACA는 "EU AI Act는 룰북, ISO 42001은 운영 시스템"으로 두 표준을 연계 활용할 것을 권한다.

---

## 강점·약점의 정직한 정리

**AI Agent의 강점은 자율성과 비정형 업무 처리력**이다. Accenture 연구에서 GitHub Copilot 사용 시 코딩 속도가 **55% 향상**됐고, Stripe의 Minions 에이전트는 **주당 1,000+ 머지된 PR**을 생산했다. 레거시 마이그레이션(COBOL→Java, Perl→Python)은 a16z가 "AI 코딩에서 가장 성공적 use case"로 꼽는 영역이다. 운영 자동화에서도 Deutsche Telekom의 RAN Guardian 사례처럼 **routine infrastructure 작업의 60~80% 자동화, 초기 deployment의 20~40% run-rate cost 감소** 효과가 McKinsey 사례에서 확인된다.

**약점은 환각·비결정성·디버깅 난이도**다. AI 생성 코드의 **29~45%에 보안 취약점**이 발견되며, package recommendation의 **20%가 존재하지 않는 라이브러리**를 가리킨다. Air Canada 챗봇이 잘못된 환불 정책을 안내한 소송, Cursor의 "Sam" 헬프데스크 봇이 가짜 로그인 정책을 만들어 사용자를 이탈시킨 2025년 4월 사건이 대표적이다. McKinsey는 **51% 기업이 AI의 부정적 영향을 경험했으나 평균 4개의 AI 위험만 완화**(2022년 2개)한다고 보고한다.

**Low-Code의 강점은 속도, 표준화, 거버넌스의 결합**이다. 개발 시간을 **50~90% 단축**하고, 시각적 모델링과 중앙 IDE로 기술 부채를 통제 가능한 수준에 묶어둔다. Pega GenAI Blueprint는 **주당 1,000+ 앱 디자인을 자동 생성**하며, AI 결합 시 효과는 더 커진다. 약점은 **커스터마이징 한계(60% 사용자가 "고급 기능 부족" 응답), 벤더 락인, 누적 라이선스 비용**이다. Mendix 자체 보고서에서조차 "**vibe coding 프로젝트 90%가 실제 환경에서 실패**"한다고 인정하며, Microsoft는 2026년 11월부터 AI Builder를 Copilot Credits로 통합 청구하는 등 가격 체계가 복잡해지고 있다.

---

## 컨버전스가 표준이 됐다 — Use Case 적합성 매핑

**2025년의 결정적 변화는 두 접근법의 경계가 사라지고 있다는 점이다.** Gartner LCAP 정의 자체에 generative AI가 들어왔고, Forrester는 LCAP의 후속 카테고리를 "**Application Generation Platform(AppGen)**" 으로 명명했다. IDC는 두 영역을 통합한 "Generative AI, Low-Code and Agentic AI Developer Technologies" 서비스 라인을 신설했다. Forrester의 John Bratincevic은 "조직의 low-code 성숙도와 GenAI 채택·성공 간 강한 상관관계가 있다"고 분석하며, **low-code의 거버넌스·정보보안·감사 도구를 agentic AI에도 그대로 재활용 가능**하다는 점을 권고의 핵심으로 둔다.

적합성을 단순화하면 다음 매핑이 유효하다.

**AI Agent가 우월한 영역**: 복잡한 코드 생성·리팩토링, 비정형 분석, 고객 지원 챗봇, 다단계 reasoning, 컴퓨터 사용 자동화. McKinsey는 IT(22%)·소프트웨어 엔지니어링(24%)·제품/서비스 개발(18%)에서 agentic 도입이 가장 앞서며, Cisco는 **2028년까지 기술 벤더 고객지원의 68%가 agentic AI**가 처리할 것으로 본다.

**Low-Code가 우월한 영역**: 표준 워크플로우(승인·결재), CRUD 내부 도구, ERP/CRM 연동, mission-critical 엔터프라이즈 앱(보험 청구, 은행 온보딩), FedRAMP·HIPAA 같은 규제 환경. Forrester는 Power Platform이 거버넌스·보안·가드레일에서 사용자 평가 최상위라고 평가했다.

**하이브리드가 적합한 영역이 가장 빠르게 성장하고 있다.** Mendix Agents Kit, OutSystems Agent Workbench, Power Platform Copilot Studio agents는 시민 개발자가 만든 워크플로우 안에 AI agent를 노드로 삽입하게 한다. n8n은 GitHub stars가 7주 만에 75k에서 100k로 폭증하며 내장 AI Agent 노드와 MCP Client Tool을 제공한다. **OpenAI AgentKit**(2025년 10월), **Google Opal**(2025년 7월) 같은 신규 진입자도 LCAP 벤더와 직접 경쟁 구도를 형성한다.

---

## 한국 시장의 결정 변수 — AI 기본법과 프론티어 사례

**한국은 EU에 이어 세계 두 번째로 본격적 AI 기본법을 가진 시장이 됐다.** 「인공지능 발전과 신뢰 기반 조성 등에 관한 기본법」(법률 제20676호)은 2025년 1월 21일 공포돼 **2026년 1월 22일 시행**된다. 투명성(AI 생성물 고지), 고영향 AI 사업자 책무, AI 영향평가, 해외 사업자 국내대리인 지정이 핵심이며, **정부는 1년 이상 과태료 계도 기간을 운영**해 실제 처벌은 2027년 이후가 될 가능성이 크다. 반면 디지털플랫폼정부위원회는 정권 교체 후 2025년 11월 4일 폐지됐고, 신정부는 "대한민국 AI 행동계획 2026"으로 전략을 재편 중이다.

기업 도입은 빠르게 진전 중이다. 한국은행 2024년 8월 보고서에 따르면 **국내 근로자 63.5%가 GenAI 사용 경험**이 있고, Microsoft Work Trend Index 2025에서 **한국 리더의 77%가 향후 12~18개월 내 디지털 노동력으로 직원 역량을 확대**할 계획이라고 답했다. Microsoft Korea가 2025년 9월 발표한 frontier firm 사례는 사실상 LCAP+AI Agent 하이브리드의 한국형 청사진이다 — KB라이프(M365 Copilot 전사), LG전자 HS본부 'CHATDA(찾다)'(Azure OpenAI 기반 agentic 플랫폼), SK이노베이션·아모레퍼시픽·이마트·포스코인터내셔널·한화큐셀(Power Platform + Azure AI 결합, 시장 출시 속도 30%+ 향상). OutSystems의 한·일 'AI Agent Hackathon 2025'에서는 한화시스템의 'Welli'(고령층 음성 AI 생활지원)가 1위를 차지했다. 국내 벤더로는 **삼성SDS Brity Copilot**(FabriX 기반, 100여 개 기업 도입, 회의록 작성 시간 100분→30분)과 **LG CNS AgenticWorks/a:xink**(Builder/Studio 6개 모듈, LG디스플레이 파일럿에서 생산성 10%·연 100억원+ 비용 절감)가 자체 솔루션을 확장 중이다.

---

## 도입 권고 — 페이스 레이어와 거버넌스 우선

**가장 위험한 선택은 "AI Agent vs Low-Code" 양자택일이다.** Gartner의 **Pace-Layered Application Strategy**가 가장 실용적인 의사결정 프레임을 제공한다 — Systems of Record(ERP·CRM, 안정·저속)는 LCAP의 강한 거버넌스로, Systems of Differentiation(중기·맞춤형)은 LCAP+AI Agent 결합으로, **Systems of Innovation(실험·고속)은 vibe coding과 AI Agent로** 분리해 각 레이어에 맞는 통제를 적용해야 한다. McKinsey의 권고도 같은 맥락이다 — "**20개 워크플로우에 분산하지 말고 가장 가치 높은 1개를 end-to-end 재설계**"하고, 고성능 기업은 fundamental workflow redesign을 추구할 가능성이 동료 대비 2.8배 높다.

단계별 전략은 **PoC → Pilot → Scale**의 3단계가 현실적이다. PoC 단계에서는 Lovable·v0·Bolt 같은 도구로 3일 내 prototype을 만들고, Pilot 단계에서 LCAP의 거버넌스를 입혀 1~3개 use case를 검증하며, Scale 단계에서는 Center of Excellence와 Managed Environments, AI Agent Fabric, MCP 표준화, FinOps를 적용한다. 거버넌스 구축의 핵심 원칙은 다음과 같다.

- **Identity-first 접근**으로 human과 machine identity를 통합 관리하고 AI agent에 least-privilege를 적용한다.
- **AI Registry**를 운영해 승인된 모델·data connector·owner를 인벤토리화하고, ISO/IEC 42001과 NIST AI RMF, EU AI Act에 정렬한다.
- **자율 신고형 등록 워크플로**로 정책 단속이 아닌 협력 거버넌스를 구축해 shadow AI를 양성화한다.

위험 관리에서는 **HITL(Human-in-the-Loop) 비율이 핵심 차별 요소**다. McKinsey는 high performer의 65%가 HITL 검증을 정의한 반면 low performer는 23%에 그친다고 보고한다. Forrester가 Salesforce Dreamforce 2025 분석에서 강조했듯, "전사 자동화"보다 **sales·marketing·customer service 같은 좁은 use case부터 시작**하고 multi-vendor agent orchestration(Agent Fabric, Control Tower)을 필수로 도입하는 것이 검증된 경로다.

---

## 결론 — 가치를 결정하는 것은 거버넌스와 워크플로우다

세 가지 통찰이 이 분석의 핵심이다. **첫째**, Low-Code와 AI Agent의 시장 성장률은 다르지만(11~16% vs 40~50%), 2025년 이후 두 시장은 같은 카테고리로 통합되고 있다 — Gartner가 LCAP 정의에 generative AI를 명시하고 IDC가 통합 서비스 라인을 만든 것이 결정적 증거다. **둘째**, McKinsey 데이터의 **88% 채택 vs 39% EBIT 영향**이라는 격차는 기술 선택이 아니라 **워크플로우 재설계와 거버넌스 성숙도**가 ROI를 결정한다는 점을 보여준다. Faros AI와 METR의 생산성 역설은 AI 도입만으로는 가치가 자동 발생하지 않는다는 사실을 정량화했다. **셋째**, 2025년 가장 빠르게 부상한 리스크는 shadow AI다 — IBM이 측정한 사고당 $670K 추가 비용과 Gartner의 "2030년 40%+ 기업이 사고 경험" 전망은 보안 투자 우선순위를 재편할 만큼 실체적이다.

따라서 2026년을 향한 권고는 명확하다. **AI Agent를 단독 도구로 도입하지 말고, LCAP의 거버넌스 인프라 위에 배치하라.** 한국 기업의 경우 2026년 1월 AI 기본법 시행과 1년 계도 기간을 ISO 42001 정렬과 AI Registry 구축의 골든타임으로 활용하는 것이 합리적이다. 페이스 레이어로 워크로드를 분리하고, 가장 가치 높은 워크플로우 1~2개를 end-to-end 재설계하며, HITL과 MCP 기반 멀티벤더 오케스트레이션을 표준으로 삼는 기업이 향후 3년의 ROI 격차에서 승자가 될 가능성이 가장 높다.
