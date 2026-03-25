---
layout: post
title: "클로드 디스패치(Claude Dispatch) 소개 및 시작하기"
date: 2026-03-25 10:00:00 +0900
tags: [팁]
description: "여러 Claude 에이전트를 동시에 실행하는 멀티 에이전트 프레임워크, Claude Dispatch의 개념과 실전 튜토리얼"
---

Claude를 쓰다 보면 이런 생각이 든 적 없으신가요? *"이 작업을 여러 개로 쪼개서 동시에 처리하면 훨씬 빠를 텐데..."* 바로 그 고민을 해결해 주는 것이 **Claude Dispatch**입니다. Claude Agent SDK의 핵심 기능으로, 여러 Claude 에이전트를 병렬로 생성하고 각각 독립된 작업을 맡길 수 있습니다.

---

## 클로드 디스패치란?

**Claude Dispatch**는 Anthropic의 Claude Agent SDK에서 제공하는 **멀티 에이전트 오케스트레이션** 기능입니다. 하나의 오케스트레이터(조율자) 에이전트가 작업을 분석하고, 여러 서브 에이전트(하위 에이전트)에게 개별 작업을 **디스패치(dispatch)** — 즉, 배분하여 실행시키는 방식입니다.

쉽게 비유하면, 팀장이 팀원들에게 각자 업무를 나눠주고 결과를 취합하는 것과 같습니다.

### 핵심 개념

| 용어 | 설명 |
|------|------|
| **오케스트레이터** | 전체 작업을 계획하고 서브 에이전트에게 지시하는 상위 에이전트 |
| **서브 에이전트** | 오케스트레이터의 지시를 받아 특정 작업을 수행하는 하위 에이전트 |
| **디스패치** | 작업을 서브 에이전트에게 전달하고 실행시키는 행위 |
| **병렬 실행** | 여러 서브 에이전트가 동시에 각자의 작업을 처리하는 방식 |

---

## 무엇을 할 수 있나요?

Claude Dispatch가 진가를 발휘하는 상황들을 살펴봅시다.

### 1. 병렬 리서치 및 분석

여러 주제를 동시에 조사해야 할 때 특히 강력합니다. 예를 들어 시장 조사 보고서를 작성할 때:

- 에이전트 A → 경쟁사 현황 분석
- 에이전트 B → 최신 트렌드 조사
- 에이전트 C → 고객 리뷰 수집 및 요약

세 에이전트가 동시에 작업하면 순차적으로 처리할 때보다 훨씬 빠르게 결과를 얻을 수 있습니다.

### 2. 코드베이스 탐색

대규모 코드베이스를 분석할 때 파일별로 서브 에이전트를 띄워 동시에 읽고 분석하게 할 수 있습니다.

### 3. 다단계 워크플로우 자동화

데이터 수집 → 정제 → 분석 → 보고서 생성처럼 순서가 있는 작업도 각 단계를 전문화된 에이전트에게 맡길 수 있습니다.

### 4. 특화된 에이전트 구성

작업 유형에 따라 각기 다른 역할의 에이전트를 구성할 수 있습니다.

- **검색 전문 에이전트**: 웹 검색 및 정보 수집
- **코드 전문 에이전트**: 코드 작성 및 리뷰
- **요약 전문 에이전트**: 긴 문서 요약

---

## 시작하기 튜토리얼

### 사전 준비

Python 환경과 Anthropic SDK가 필요합니다.

```bash
pip install anthropic
```

환경 변수에 API 키를 설정합니다.

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

---

### 기본 구조 이해하기

Claude Dispatch는 `claude-agent-sdk` 또는 Claude API의 tool use 기능을 기반으로 동작합니다. 오케스트레이터 에이전트가 `Agent` 툴을 호출하면 서브 에이전트가 독립적인 컨텍스트에서 실행됩니다.

```python
import anthropic

client = anthropic.Anthropic()
```

---

### 예제 1: 단순 서브 에이전트 실행

가장 기본적인 형태입니다. 오케스트레이터가 하나의 서브 에이전트에게 요약 작업을 맡기는 예시입니다.

```python
import anthropic

client = anthropic.Anthropic()

def run_subagent(task: str) -> str:
    """단일 서브 에이전트를 실행하고 결과를 반환합니다."""
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": task
            }
        ]
    )
    return response.content[0].text

# 오케스트레이터가 작업을 분배하는 함수
def orchestrate(topics: list[str]) -> dict:
    results = {}
    for topic in topics:
        task = f"다음 주제에 대해 3문장으로 간략하게 설명해주세요: {topic}"
        results[topic] = run_subagent(task)
    return results

# 실행
topics = ["인공지능", "블록체인", "양자컴퓨터"]
results = orchestrate(topics)

for topic, summary in results.items():
    print(f"\n## {topic}")
    print(summary)
```

---

### 예제 2: 병렬 실행으로 속도 향상

`concurrent.futures`를 활용하면 여러 에이전트를 동시에 실행할 수 있습니다.

```python
import anthropic
from concurrent.futures import ThreadPoolExecutor, as_completed

client = anthropic.Anthropic()

def run_subagent(topic: str) -> tuple[str, str]:
    """서브 에이전트 실행 (병렬 실행용)"""
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=512,
        messages=[
            {
                "role": "user",
                "content": f"'{topic}'에 대해 핵심 내용을 불릿 포인트 3개로 정리해주세요."
            }
        ]
    )
    return topic, response.content[0].text

def parallel_orchestrate(topics: list[str]) -> dict:
    """여러 서브 에이전트를 병렬로 실행합니다."""
    results = {}

    # 최대 3개 스레드로 병렬 실행
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = {executor.submit(run_subagent, topic): topic for topic in topics}

        for future in as_completed(futures):
            topic, result = future.result()
            results[topic] = result
            print(f"✅ '{topic}' 완료")

    return results

# 실행
topics = ["머신러닝", "딥러닝", "강화학습", "자연어처리"]
results = parallel_orchestrate(topics)
```

> **📌 성능 팁:** API 요청은 I/O 바운드 작업이므로 `ThreadPoolExecutor`가 효과적입니다. CPU 바운드 작업이라면 `ProcessPoolExecutor`를 고려하세요.

---

### 예제 3: 전문화된 에이전트 파이프라인

실제 업무에서 자주 쓰이는 패턴입니다. 각 단계를 전문 에이전트가 처리하는 파이프라인을 구성합니다.

```python
import anthropic

client = anthropic.Anthropic()

def collector_agent(topic: str) -> str:
    """수집 에이전트: 주어진 주제에 대한 정보를 수집합니다."""
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        system="당신은 정보 수집 전문 에이전트입니다. 주어진 주제에 대해 사실 기반의 정보를 나열하세요.",
        messages=[{"role": "user", "content": f"주제: {topic}\n관련된 주요 사실과 정보를 10가지 나열하세요."}]
    )
    return response.content[0].text

def analyzer_agent(raw_data: str) -> str:
    """분석 에이전트: 수집된 정보를 분석하고 인사이트를 도출합니다."""
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        system="당신은 데이터 분석 전문 에이전트입니다. 제공된 정보에서 핵심 패턴과 인사이트를 찾으세요.",
        messages=[{"role": "user", "content": f"다음 정보를 분석하세요:\n\n{raw_data}"}]
    )
    return response.content[0].text

def writer_agent(analysis: str) -> str:
    """작성 에이전트: 분석 결과를 바탕으로 보고서를 작성합니다."""
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=2048,
        system="당신은 전문 보고서 작성 에이전트입니다. 분석 내용을 바탕으로 읽기 쉬운 보고서를 작성하세요.",
        messages=[{"role": "user", "content": f"다음 분석을 바탕으로 보고서를 작성하세요:\n\n{analysis}"}]
    )
    return response.content[0].text

def run_pipeline(topic: str) -> str:
    """수집 → 분석 → 작성 파이프라인을 실행합니다."""
    print(f"1️⃣ 수집 에이전트 실행 중...")
    raw_data = collector_agent(topic)

    print(f"2️⃣ 분석 에이전트 실행 중...")
    analysis = analyzer_agent(raw_data)

    print(f"3️⃣ 작성 에이전트 실행 중...")
    report = writer_agent(analysis)

    return report

# 실행
topic = "2026년 AI 트렌드"
final_report = run_pipeline(topic)
print("\n📄 최종 보고서:")
print(final_report)
```

---

## Claude Code에서의 Dispatch

Claude Code(CLI 도구)를 사용 중이라면, 내장된 **Agent 툴**을 통해 더욱 손쉽게 서브 에이전트를 디스패치할 수 있습니다.

Claude Code는 다음과 같은 특화 에이전트 타입을 제공합니다:

| 에이전트 타입 | 용도 |
|--------------|------|
| `general-purpose` | 복잡한 다단계 작업 처리 |
| `Explore` | 코드베이스 탐색 및 파일 검색 |
| `Plan` | 구현 계획 설계 |

코드에서 직접 모델을 호출하지 않고도, 자연어 지시로 에이전트를 디스패치할 수 있습니다.

> **⚠️ 주의:** 독립적인 작업은 병렬로 디스패치하고, 이전 결과가 필요한 작업은 순차 실행하세요. 순서가 중요한 작업을 병렬로 실행하면 잘못된 결과가 나올 수 있습니다.

---

## 효과적인 활용 팁

### 작업을 잘게 쪼개기

에이전트 하나에 너무 많은 작업을 주면 품질이 떨어집니다. **단일 책임 원칙**을 적용하세요 — 에이전트 하나당 명확한 역할 하나를 부여하세요.

### 명확한 시스템 프롬프트 작성

각 에이전트에게 역할을 명확히 설명하는 `system` 프롬프트를 제공하면 성능이 크게 향상됩니다.

```python
# ❌ 모호한 지시
messages=[{"role": "user", "content": "이것을 분석하세요"}]

# ✅ 명확한 역할 부여
system = "당신은 금융 데이터 분석 전문가입니다. 숫자와 트렌드에 집중하여 객관적인 분석을 제공하세요."
messages=[{"role": "user", "content": "다음 재무제표를 분석하세요: ..."}]
```

### 에러 처리 추가

실제 서비스에서는 반드시 에러 처리를 포함하세요.

```python
def safe_run_subagent(task: str) -> str:
    try:
        response = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=1024,
            messages=[{"role": "user", "content": task}]
        )
        return response.content[0].text
    except anthropic.RateLimitError:
        print("요청 한도 초과. 잠시 후 재시도합니다.")
        return ""
    except anthropic.APIError as e:
        print(f"API 오류: {e}")
        return ""
```

---

## 마치며

Claude Dispatch는 단순한 채팅 봇 수준을 넘어, **실제 업무를 자동화하는 AI 워크플로우**를 구성할 수 있게 해줍니다. 처음에는 단순한 순차 실행부터 시작해서, 익숙해지면 병렬 실행과 전문화된 파이프라인으로 확장해 보세요.

멀티 에이전트 시스템은 AI 활용의 다음 단계입니다. 지금 바로 시작해 보세요.
