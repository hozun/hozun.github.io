import { useCallback, useState } from 'react';
import type { DayOfWeek, Schedule } from '../types/schedule';
import { loadSchedules, saveSchedules } from '../utils/storage';
import { getDurationMinutes, minutesToTime, timeToMinutes } from '../utils/time';

function newId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

type ScheduleData = Pick<Schedule, 'title' | 'startTime' | 'endTime' | 'color'>;

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>(() => loadSchedules());

  const persist = useCallback((next: Schedule[]) => {
    setSchedules(next);
    saveSchedules(next);
  }, []);

  /** 여러 요일에 일정 추가. 2개 이상이면 groupId를 공유 */
  const addSchedules = useCallback(
    (days: DayOfWeek[], data: ScheduleData) => {
      const groupId = days.length > 1 ? newId() : undefined;
      const newOnes = days.map((day) => ({
        ...data,
        id: newId(),
        groupId,
        dayOfWeek: day,
      }));
      persist([...schedules, ...newOnes]);
    },
    [schedules, persist],
  );

  /**
   * 그룹(또는 단일) 일정 교체.
   * - 기존 그룹/단일 삭제 후 newDays로 재생성
   * - newDays가 2개 이상이면 groupId 유지 또는 새로 발급
   */
  const replaceGroup = useCallback(
    (targetId: string, groupId: string | undefined, newDays: DayOfWeek[], data: ScheduleData) => {
      const filtered = groupId
        ? schedules.filter((s) => s.groupId !== groupId)
        : schedules.filter((s) => s.id !== targetId);

      const newGroupId = newDays.length > 1 ? (groupId ?? newId()) : undefined;

      const newOnes = newDays.map((day) => ({
        ...data,
        id: newId(),
        groupId: newGroupId,
        dayOfWeek: day,
      }));

      persist([...filtered, ...newOnes]);
    },
    [schedules, persist],
  );

  /** 그룹 전체(또는 단일) 삭제 */
  const deleteGroup = useCallback(
    (id: string, groupId?: string) => {
      persist(
        groupId
          ? schedules.filter((s) => s.groupId !== groupId)
          : schedules.filter((s) => s.id !== id),
      );
    },
    [schedules, persist],
  );

  /** DnD용: 개별 일정의 요일/시간만 이동 */
  const moveSchedule = useCallback(
    (id: string, newDay: DayOfWeek, newStartTime: string) => {
      persist(
        schedules.map((s) => {
          if (s.id !== id) return s;
          const duration = getDurationMinutes(s.startTime, s.endTime);
          const newEnd = minutesToTime(timeToMinutes(newStartTime) + duration);
          return { ...s, dayOfWeek: newDay, startTime: newStartTime, endTime: newEnd };
        }),
      );
    },
    [schedules, persist],
  );

  /** import용: 전체 교체 */
  const replaceAll = useCallback(
    (next: Schedule[]) => persist(next),
    [persist],
  );

  /** import용: 기존에 추가 (ID 충돌 방지를 위해 새 ID 발급) */
  const mergeAll = useCallback(
    (incoming: Schedule[]) => {
      const groupIdMap = new Map<string, string>();
      const remapped = incoming.map((s) => {
        let newGroupId: string | undefined;
        if (s.groupId) {
          if (!groupIdMap.has(s.groupId)) groupIdMap.set(s.groupId, newId());
          newGroupId = groupIdMap.get(s.groupId);
        }
        return { ...s, id: newId(), groupId: newGroupId };
      });
      persist([...schedules, ...remapped]);
    },
    [schedules, persist],
  );

  return { schedules, addSchedules, replaceGroup, deleteGroup, moveSchedule, replaceAll, mergeAll };
}
