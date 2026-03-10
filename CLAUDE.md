# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # 개발 서버 실행 (http://localhost:5173)
npm run build    # 프로덕션 빌드 (tsc + vite)
npm run lint     # ESLint 검사
npm run preview  # 빌드 결과 미리보기
```

## Tech Stack

- **Vite + React + TypeScript** (verbatimModuleSyntax 활성화 → 타입 import 시 `import type` 필수)
- **Tailwind CSS v4** (`@tailwindcss/vite` 플러그인, config 파일 없음, `src/index.css`에서 `@import "tailwindcss"`)
- **@dnd-kit/core** + **@dnd-kit/utilities** — 드래그앤드롭
- **localStorage** — 데이터 영속성 (백엔드 없음)

## Architecture

```
src/
  types/schedule.ts        # Schedule 인터페이스, DayOfWeek 타입 (0=월 ~ 6=일)
  utils/time.ts            # 시간 변환 유틸, 상수 (SLOT_HEIGHT, HOURS, DAYS_KO, SCHEDULE_COLORS 등)
  utils/storage.ts         # localStorage CRUD
  hooks/useSchedules.ts    # 일정 CRUD 상태 관리 (addSchedule, updateSchedule, deleteSchedule, moveSchedule)
  components/
    WeeklyCalendar.tsx     # 최상위 컴포넌트. DndContext, 헤더, 시간 레이블, FAB, 모달 상태 관리
    DayColumn.tsx          # 요일 컬럼. DroppableCell(30분 단위) + ScheduleBlock 절대 위치 배치
    ScheduleBlock.tsx      # useDraggable로 드래그 가능한 일정 블록
    ScheduleFormModal.tsx  # 일정 추가/수정 바텀시트 모달
```

### 핵심 설계 결정

- **요일 번호**: `DayOfWeek 0=월 ~ 6=일` (JS `getDay()`의 0=일과 다름 → `(jsDay + 6) % 7`로 변환)
- **드롭 셀 ID 형식**: `cell-{dayOfWeek}-{hour}-{minute}` (예: `cell-2-9-30` = 수요일 9:30)
- **그리드 높이**: `SLOT_HEIGHT = 32px` per 30분, 9시~21시 총 768px
- **일정 블록 위치**: 절대 위치 (`top`, `height`를 시간으로 계산)
- **드래그 활성화**: 마우스 8px 이동 / 터치 200ms 딜레이 + 5px 허용 (스크롤과 구분)
- **충돌 감지**: `pointerWithin` (238개 셀 성능 최적화)
