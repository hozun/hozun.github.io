import { useEffect, useState } from 'react';
import type { DayOfWeek } from '../types/schedule';
import { DAYS_KO, END_HOUR, SCHEDULE_COLORS, START_HOUR } from '../utils/time';

export interface ScheduleFormData {
  title: string;
  days: DayOfWeek[]; // 추가: 다중 선택 / 수정: 항상 1개
  startTime: string;
  endTime: string;
  color: string;
}

const MIN_TIME = `${String(START_HOUR).padStart(2, '0')}:00`;
const MAX_TIME = `${String(END_HOUR).padStart(2, '0')}:00`;

interface Props {
  mode: 'add' | 'edit';
  initial: ScheduleFormData;
  onSave: (data: ScheduleFormData) => void;
  onDelete?: () => void;
  onClose: () => void;
}

export function ScheduleFormModal({ mode, initial, onSave, onDelete, onClose }: Props) {
  const [form, setForm] = useState<ScheduleFormData>(initial);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(initial);
    setError('');
  }, [initial]);

  const set = <K extends keyof ScheduleFormData>(key: K, value: ScheduleFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function toggleDay(day: DayOfWeek) {
    const next = form.days.includes(day)
      ? form.days.filter((d) => d !== day)
      : [...form.days, day];
    if (next.length > 0) set('days', next);
  }

  function handleSave() {
    if (!form.title.trim()) {
      setError('일정 제목을 입력해주세요.');
      return;
    }
    if (form.days.length === 0) {
      setError('요일을 선택해주세요.');
      return;
    }
    const startMin = toMinutes(form.startTime);
    const endMin = toMinutes(form.endTime);
    const minMin = START_HOUR * 60;
    const maxMin = END_HOUR * 60;

    if (startMin < minMin || startMin >= maxMin) {
      setError(`시작 시간은 ${MIN_TIME} ~ ${MAX_TIME} 사이여야 합니다.`);
      return;
    }
    if (endMin > maxMin) {
      setError(`종료 시간은 ${MAX_TIME} 이하여야 합니다.`);
      return;
    }
    if (endMin - startMin < 30) {
      setError('종료 시간은 시작 시간보다 30분 이상 이후여야 합니다.');
      return;
    }
    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />

      <div
        className="relative w-full bg-white rounded-t-2xl shadow-xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 핸들 */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="px-5 pb-8 pt-2">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {mode === 'add' ? '일정 추가' : '일정 수정'}
          </h2>

          {/* 제목 */}
          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-600">제목</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="일정 이름 입력"
              className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          {/* 요일 */}
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-600 block mb-1">
              요일
              <span className="ml-1.5 text-xs text-blue-400 font-normal">(복수 선택 가능)</span>
            </span>
            <div className="flex gap-1.5">
              {DAYS_KO.map((day, i) => {
                const selected = form.days.includes(i as DayOfWeek);
                return (
                  <button
                    key={i}
                    onClick={() => toggleDay(i as DayOfWeek)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      selected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 시간 */}
          <div className="flex gap-3 mb-4">
            <label className="flex-1">
              <span className="text-sm font-medium text-gray-600">시작 시간</span>
              <input
                type="time"
                min={MIN_TIME}
                max={MAX_TIME}
                value={form.startTime}
                onChange={(e) => set('startTime', e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>
            <label className="flex-1">
              <span className="text-sm font-medium text-gray-600">종료 시간</span>
              <input
                type="time"
                min={MIN_TIME}
                max={MAX_TIME}
                value={form.endTime}
                onChange={(e) => set('endTime', e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>
          </div>

          {/* 색상 */}
          <div className="mb-5">
            <span className="text-sm font-medium text-gray-600 block mb-2">색상</span>
            <div className="flex gap-2">
              {SCHEDULE_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => set('color', c)}
                  style={{ backgroundColor: c }}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    form.color === c ? 'scale-125 ring-2 ring-offset-1 ring-gray-400' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          {/* 버튼 */}
          <div className="flex gap-2">
            {onDelete && (
              <button
                onClick={onDelete}
                className="flex-none px-4 py-3 rounded-xl bg-red-50 text-red-500 font-semibold text-sm"
              >
                삭제
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-semibold text-sm"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}
