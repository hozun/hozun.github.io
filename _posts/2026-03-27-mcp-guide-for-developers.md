---
layout: post
title: "MCP(Model Context Protocol) — 초·중급 개발자를 위한 완벽 개념 가이드"
date: 2026-03-27 15:09:00 +0900
tags: [인공지능, 개발]
description: "AI가 세상과 단절된 섬에서 벗어나는 방법. MCP가 뭔지, 왜 중요한지, 어떻게 만드는지 초중급 개발자 눈높이에서 낱낱이 풀어본다."
---

AI를 쓰다 보면 한 가지 벽에 자꾸 부딪힌다. "이거 파일 좀 읽어줄 수 있어?"라고 하면 "저는 파일 시스템에 접근할 수 없어요"라는 답이 돌아온다. 데이터베이스 조회, Slack 메시지 전송, GitHub 이슈 확인... 전부 마찬가지다. 아무리 똑똑한 AI라도 혼자서는 **세상과 단절된 섬** 위에 있다.

이 문제를 근본적으로 해결하려고 나온 게 **MCP(Model Context Protocol)**다. 2024년 Anthropic이 공개한 오픈 스탠다드인데, 2026년 현재 AI 개발 생태계에서 가장 뜨거운 키워드 중 하나가 됐다. 초중급 개발자라면 지금 이해해두는 게 맞다.

---

## AI는 왜 혼자서는 아무것도 못 하나

LLM의 구조를 생각해보자. ChatGPT든 Claude든, 기본적으로 **텍스트를 입력받아 텍스트를 출력하는 기계**다. 학습 데이터로 세상을 이해하고 있지만, 지금 이 순간 실제로 일어나는 일들 — 내 컴퓨터의 파일, 회사 DB의 데이터, 오늘자 뉴스 — 은 모른다.

그러면 연동하면 되지 않냐고? 맞다. 그게 지금까지 해오던 방식이다. 문제는 **파편화**다.

- A 서비스는 REST API로 연동
- B 서비스는 웹소켓
- C 서비스는 자체 SDK
- D 서비스는 플러그인 시스템

AI 도구마다, 서비스마다 연동 방식이 제각각이다. 개발자는 새 AI 제품이 나올 때마다, 새 서비스를 연결할 때마다 처음부터 다시 만들어야 한다. 재사용이 안 된다. 유지보수가 힘들다. 생태계가 파편화된다.

MCP는 이 문제에 대한 답이다.

---

## MCP = AI 세계의 USB-C

비유가 와닿는다. USB-C가 나오기 전을 생각해보라. 기기마다 충전 단자가 달랐다. 아이폰은 라이트닝, 안드로이드는 마이크로USB, 노트북은 독자 규격... 케이블 가방이 따로 필요했다.

USB-C는 "이제 이 표준 하나로 다 연결하자"고 선언했다. MCP가 딱 그 역할이다.

**어떤 AI 클라이언트든, 어떤 외부 서비스든 — MCP라는 표준 규격으로 연결한다.**

서비스를 제공하는 쪽은 MCP 서버 하나만 만들면, 모든 MCP 지원 AI에서 그 기능을 쓸 수 있다. AI 클라이언트 개발자는 MCP 프로토콜 하나만 구현하면, 수천 개의 MCP 서버와 호환된다. 양쪽 모두 윈이다.

---

## MCP 구조 핵심 3요소

코드 보기 전에 구조부터 머릿속에 그려야 한다.

### MCP Host

사용자가 직접 쓰는 AI 애플리케이션이다. Claude Desktop, Cursor, VS Code Copilot, Zed 같은 것들. 사용자는 Host와 대화한다.

### MCP Client

Host 내부에 있는 컴포넌트다. MCP 서버와 실제로 통신하는 역할을 한다. 사용자 입장에서는 보이지 않는다. 내부 구현체라고 생각하면 된다.

### MCP Server

실제 기능을 제공하는 서버다. "파일시스템 MCP 서버", "GitHub MCP 서버", "PostgreSQL MCP 서버" 이런 식으로 각 외부 시스템마다 따로 만든다. 로컬에서 돌아도 되고, 리모트 서버여도 된다.

세 요소의 관계를 한 줄로 정리하면 이렇다.

```
사용자 → Host(Claude Desktop) → MCP Client → MCP Server(GitHub) → GitHub API
```

### MCP 서버가 제공하는 세 가지

MCP 서버는 크게 세 종류의 기능을 AI에게 제공한다.

**Tools** — AI가 호출할 수 있는 함수다. "파일 읽기", "DB 쿼리 실행", "이메일 전송" 같은 것. AI가 "이 툴을 실행해야겠다"고 판단하면 MCP 서버에 호출 요청을 보내고, 결과를 받아서 응답에 활용한다.

**Resources** — AI가 참조할 수 있는 데이터 소스다. 문서, 설정 파일, 데이터베이스 스키마처럼 "읽기용" 컨텍스트를 제공한다. Tools가 "실행"이라면 Resources는 "조회"다.

**Prompts** — 재사용 가능한 프롬프트 템플릿이다. 자주 쓰는 지시 패턴을 서버 측에 정의해두고 불러쓰는 방식. 팀 내 공통 AI 사용 패턴을 표준화할 때 유용하다.

---

## 실제 흐름으로 이해하기

말로 설명하는 것보다 예시가 빠르다.

### 예시 1: Claude가 GitHub PR을 조회하는 흐름

1. 사용자가 Claude Desktop에서 입력한다: `"이번 주 머지된 PR 목록 보여줘"`
2. Claude(LLM)가 판단한다: `"GitHub MCP 서버의 list_pull_requests 툴을 써야겠다"`
3. MCP Client가 GitHub MCP 서버에 요청을 보낸다: `list_pull_requests({ state: "closed", since: "2026-03-24" })`
4. GitHub MCP 서버가 GitHub API를 호출해 결과를 가져온다
5. 결과가 MCP Client → Claude → 사용자 순으로 전달된다
6. Claude가 결과를 요약해서 자연어로 응답한다

### 예시 2: Slack MCP로 메시지 보내기

1. 사용자: `"#dev-team 채널에 배포 완료 됐다고 알려줘"`
2. Claude: `send_message` 툴 호출 결정
3. Slack MCP 서버 → Slack API → 채널에 메시지 전송
4. Claude: `"#dev-team에 메시지 보냈습니다"`

### 예시 3: 파일시스템 MCP로 로컬 파일 처리

1. 사용자: `"프로젝트 루트의 README 읽고 요약해줘"`
2. Claude: `read_file` 툴로 `/Users/hojun/project/README.md` 요청
3. 파일시스템 MCP 서버가 파일 내용 반환
4. Claude가 내용을 요약해서 응답

세 예시 모두 흐름이 똑같다. AI가 판단 → MCP 서버에 요청 → 실제 시스템 작동 → 결과 반환 → AI가 응답. 이 패턴이 MCP의 전부다.

---

## 직접 만들어보기

REST API 만들 줄 안다면 MCP 서버도 만들 수 있다. 진짜로. Node.js 기준으로 최소 구현을 보자.

먼저 SDK를 설치한다.

```bash
npm install @modelcontextprotocol/sdk
```

가장 단순한 MCP 서버 — 인사말을 반환하는 `say_hello` 툴 하나짜리다.

```javascript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  { name: "hello-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// 사용 가능한 툴 목록 반환
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "say_hello",
        description: "이름을 입력받아 인사말을 반환합니다",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "인사할 대상 이름" },
          },
          required: ["name"],
        },
      },
    ],
  };
});

// 툴 실행 처리
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "say_hello") {
    const { name } = request.params.arguments;
    return {
      content: [{ type: "text", text: `안녕하세요, ${name}님!` }],
    };
  }
  throw new Error("Unknown tool");
});

// 서버 시작
const transport = new StdioServerTransport();
await server.connect(transport);
```

이게 전부다. `ListTools`에서 툴을 선언하고, `CallTool`에서 실행 로직을 처리한다. Express로 라우터 만드는 것과 구조가 비슷하다.

### Claude Desktop에 연결하기

만든 서버를 Claude Desktop에 연결하려면 설정 파일을 수정한다.

macOS 기준 경로: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "hello-server": {
      "command": "node",
      "args": ["/절대경로/hello-server.js"]
    }
  }
}
```

Claude Desktop을 재시작하면 끝이다. 이제 Claude에게 "say_hello 써서 나한테 인사해봐"라고 하면 실제로 MCP 서버가 호출된다.

---

## 2026년 MCP 생태계 현황

Anthropic이 공식으로 유지하는 MCP 서버만 해도 상당수다. GitHub, Slack, Google Drive, PostgreSQL, Brave Search, Puppeteer(브라우저 자동화), 파일시스템 등. 오픈소스로 공개되어 있어서 코드를 직접 뜯어볼 수 있다.

커뮤니티 기여도 폭발적이다. MCP 레지스트리에는 수백 개의 서버가 등록되어 있다. Notion, Jira, Figma, AWS, Kubernetes... 웬만한 서비스는 이미 누군가가 만들어놨다.

클라이언트 생태계도 빠르게 확장 중이다. 초기에는 Claude Desktop 정도였지만, 지금은 Cursor, VS Code(GitHub Copilot), Zed, JetBrains 계열 IDE까지 MCP를 지원한다. 표준이 자리를 잡아가고 있다는 신호다.

---

## 초중급 개발자에게 당부하고 싶은 것

**MCP 서버 하나 만들어봐라.** 진짜로. 개념을 이해하는 것과 손으로 한 번 만들어보는 것은 차원이 다르다. 아무 서비스나 골라라 — 날씨 API든, 회사 내부 API든. MCP 서버로 감싸서 Claude에 연결해보면, AI 연동 개발의 패러다임이 어떻게 바뀌고 있는지 체감이 된다.

**REST API 만들 줄 알면 충분하다.** MCP가 뭔가 거창해 보이지만, 결국 HTTP 요청/응답 구조에 익숙한 개발자라면 하루 안에 첫 MCP 서버를 만들 수 있다. 공식 SDK가 Node.js, Python 모두 지원된다. 진입장벽이 생각보다 낮다.

**보안은 처음부터 신경 써라.** MCP 서버는 AI에게 실제 시스템 접근 권한을 준다. DB 크리덴셜, API 키, 파일 경로 같은 민감 정보를 MCP 서버에 하드코딩하거나 응답으로 그대로 노출하면 안 된다. 환경변수 관리, 권한 최소화, 입력값 검증 — 일반 백엔드 개발의 보안 원칙이 그대로 적용된다.

---

## 마무리: 왜 지금 알아야 하나

MCP는 "AI를 도구로 쓰는 방식"의 표준이 되어가고 있다. 지금은 AI가 대화만 잘하면 됐던 시대에서, AI가 실제로 일을 처리하는 시대로 넘어가는 과도기다.

이 전환에서 살아남으려면 AI와 외부 시스템을 연결하는 방법을 알아야 한다. MCP는 그 연결 고리를 표준화한 것이다. 나중에 "그때 좀 알아둘걸"이라고 후회하지 말고, 지금 시작하는 게 맞다.

공식 문서는 `modelcontextprotocol.io`에 있다. SDK 예제 코드도 충실하다. 오늘 저녁 두 시간만 투자해보자.
