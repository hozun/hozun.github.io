import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useRef, useState } from 'react';
import type { DayOfWeek, Schedule } from '../types/schedule';
import { useSchedules } from '../hooks/useSchedules';
import {
  DAYS_KO,
  END_HOUR,
  HOURS,
  SCHEDULE_COLORS,
  SLOT_HEIGHT,
  minutesToTime,
  timeToMinutes,
  todayDayOfWeek,
  parseCellId,
  getBlockHeight,
} from '../utils/time';
import { DayColumn } from './DayColumn';
import { ScheduleFormModal, type ScheduleFormData } from './ScheduleFormModal';

type ModalState =
  | { mode: 'closed' }
  | { mode: 'add'; defaultDay: DayOfWeek; defaultTime: string }
  | { mode: 'edit'; schedule: Schedule; groupDays: DayOfWeek[] }
  | { mode: 'import-confirm'; incoming: Schedule[] };

const today = todayDayOfWeek();

function isValidSchedule(item: unknown): item is Schedule {
  if (!item || typeof item !== 'object') return false;
  const s = item as Record<string, unknown>;
  return (
    typeof s.id === 'string' &&
    typeof s.title === 'string' &&
    typeof s.dayOfWeek === 'number' &&
    s.dayOfWeek >= 0 &&
    s.dayOfWeek <= 6 &&
    typeof s.startTime === 'string' &&
    typeof s.endTime === 'string' &&
    typeof s.color === 'string'
  );
}

export function WeeklyCalendar() {
  const { schedules, addSchedules, replaceGroup, deleteGroup, moveSchedule, replaceAll, mergeAll } =
    useSchedules();

  const [modal, setModal] = useState<ModalState>({ mode: 'closed' });
  const [draggingSchedule, setDraggingSchedule] = useState<Schedule | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  function handleDragStart(event: DragStartEvent) {
    const s = schedules.find((x) => x.id === event.active.id);
    setDraggingSchedule(s ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setDraggingSchedule(null);
    const { active, over } = event;
    if (!over || !String(over.id).startsWith('cell-')) return;
    const { dayOfWeek, time } = parseCellId(String(over.id));
    moveSchedule(String(active.id), dayOfWeek as DayOfWeek, time);
  }

  function openEdit(s: Schedule) {
    const groupDays = s.groupId
      ? schedules
          .filter((x) => x.groupId === s.groupId)
          .map((x) => x.dayOfWeek)
          .sort((a, b) => a - b)
      : [s.dayOfWeek];
    setModal({ mode: 'edit', schedule: s, groupDays });
  }

  function closeModal() {
    setModal({ mode: 'closed' });
  }

  function handleAddSave(data: ScheduleFormData) {
    addSchedules(data.days, {
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime,
      color: data.color,
    });
    closeModal();
  }

  function handleEditSave(schedule: Schedule, data: ScheduleFormData) {
    replaceGroup(schedule.id, schedule.groupId, data.days, {
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime,
      color: data.color,
    });
    closeModal();
  }

  // ── Export ──────────────────────────────────────────────
  function handleExport() {
    const json = JSON.stringify(schedules, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-schedule-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Import ───────────────────────────────────────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ''; // 동일 파일 재선택 허용

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (!Array.isArray(parsed)) throw new Error();
        const valid = parsed.filter(isValidSchedule);
        if (valid.length === 0) throw new Error();
        setModal({ mode: 'import-confirm', incoming: valid });
      } catch {
        alert('올바른 스케줄 JSON 파일이 아닙니다.');
      }
    };
    reader.readAsText(file);
  }

  const schedulesPerDay = (day: DayOfWeek) => schedules.filter((s) => s.dayOfWeek === day);

  return (
    <div className="flex flex-col h-dvh bg-white select-none">
      {/* 앱 바 */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-2 bg-white border-b border-gray-200 z-30">
        <span className="text-sm font-bold text-gray-800">주간 스케줄</span>
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-gray-500 px-2.5 py-1.5 rounded-lg bg-gray-100 active:bg-gray-200"
          >
            가져오기
          </button>
          <button
            onClick={handleExport}
            className="text-xs text-gray-500 px-2.5 py-1.5 rounded-lg bg-gray-100 active:bg-gray-200"
          >
            내보내기
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* 요일 헤더 */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white">
        <div className="flex">
          <div className="w-9 flex-shrink-0" />
          {DAYS_KO.map((day, i) => (
            <div
              key={i}
              className={`flex-1 text-center py-2 text-xs font-semibold ${
                i === today ? 'text-blue-600' : i >= 5 ? 'text-red-400' : 'text-gray-500'
              }`}
            >
              {day}
              {i === today && (
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mx-auto mt-0.5" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 캘린더 바디 */}
      <div className="flex-1 overflow-auto">
        <div className="flex">
          <div className="sticky left-0 z-20 bg-white w-9 flex-shrink-0 border-r border-gray-200">
            {HOURS.map((hour) => (
              <div key={hour} style={{ height: `${SLOT_HEIGHT * 2}px` }} className="relative">
                <span className="absolute -top-2 right-1 text-[9px] text-gray-400 leading-none">
                  {String(hour).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex flex-1">
              {([0, 1, 2, 3, 4, 5, 6] as DayOfWeek[]).map((day) => (
                <DayColumn
                  key={day}
                  dayOfWeek={day}
                  schedules={schedulesPerDay(day)}
                  isToday={day === today}
                  onScheduleClick={openEdit}
                  onCellClick={(d, t) =>
                    setModal({ mode: 'add', defaultDay: d, defaultTime: t })
                  }
                />
              ))}
            </div>

            <DragOverlay dropAnimation={null}>
              {draggingSchedule && (
                <div
                  style={{
                    backgroundColor: draggingSchedule.color,
                    height: `${getBlockHeight(draggingSchedule.startTime, draggingSchedule.endTime)}px`,
                    width: '100%',
                  }}
                  className="rounded-md text-white text-[11px] px-1.5 py-0.5 opacity-90 shadow-lg"
                >
                  <div className="font-semibold truncate leading-tight">
                    {draggingSchedule.title}
                  </div>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() =>
          setModal({ mode: 'add', defaultDay: today as DayOfWeek, defaultTime: '09:00' })
        }
        className="fixed right-5 bottom-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg text-3xl flex items-center justify-center active:bg-blue-600 z-40"
        aria-label="일정 추가"
      >
        +
      </button>

      {/* 추가 모달 */}
      {modal.mode === 'add' && (
        <ScheduleFormModal
          mode="add"
          initial={{
            title: '',
            days: [modal.defaultDay],
            startTime: modal.defaultTime,
            endTime: minutesToTime(
              Math.min(timeToMinutes(modal.defaultTime) + 60, END_HOUR * 60),
            ),
            color: SCHEDULE_COLORS[0],
          }}
          onSave={handleAddSave}
          onClose={closeModal}
        />
      )}

      {/* 수정 모달 */}
      {modal.mode === 'edit' && (
        <ScheduleFormModal
          mode="edit"
          initial={{
            title: modal.schedule.title,
            days: modal.groupDays,
            startTime: modal.schedule.startTime,
            endTime: modal.schedule.endTime,
            color: modal.schedule.color,
          }}
          onSave={(data) => handleEditSave(modal.schedule, data)}
          onDelete={() => {
            deleteGroup(modal.schedule.id, modal.schedule.groupId);
            closeModal();
          }}
          onClose={closeModal}
        />
      )}

      {/* Import 확인 모달 */}
      {modal.mode === 'import-confirm' && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full bg-white rounded-t-2xl shadow-xl px-5 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <h2 className="text-base font-bold text-gray-800 mb-1">스케줄 가져오기</h2>
            <p className="text-sm text-gray-500 mb-5">
              {modal.incoming.length}개의 일정을 불러왔습니다. 어떻게 적용할까요?
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  mergeAll(modal.incoming);
                  closeModal();
                }}
                className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold text-sm"
              >
                기존 일정에 추가
              </button>
              <button
                onClick={() => {
                  replaceAll(modal.incoming);
                  closeModal();
                }}
                className="w-full py-3 rounded-xl bg-red-50 text-red-500 font-semibold text-sm"
              >
                기존 일정 모두 교체
              </button>
              <button
                onClick={closeModal}
                className="w-full py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
