import { useDroppable } from '@dnd-kit/core';
import type { DayOfWeek, Schedule } from '../types/schedule';
import { HOURS, SLOT_HEIGHT, TOTAL_HEIGHT } from '../utils/time';
import { ScheduleBlock } from './ScheduleBlock';

interface CellProps {
  id: string;
  isHour: boolean;
  onClick: () => void;
}

function DroppableCell({ id, isHour, onClick }: CellProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      style={{ height: `${SLOT_HEIGHT}px` }}
      className={[
        'w-full border-b border-gray-100 cursor-pointer',
        isHour ? 'border-t border-t-gray-200' : '',
        isOver ? 'bg-blue-50' : '',
      ].join(' ')}
    />
  );
}

interface Props {
  dayOfWeek: DayOfWeek;
  schedules: Schedule[];
  isToday: boolean;
  onScheduleClick: (s: Schedule) => void;
  onCellClick: (dayOfWeek: DayOfWeek, time: string) => void;
}

export function DayColumn({ dayOfWeek, schedules, isToday, onScheduleClick, onCellClick }: Props) {
  return (
    <div
      className={`relative flex-1 border-l border-gray-200 ${isToday ? 'bg-blue-50/30' : ''}`}
      style={{ height: `${TOTAL_HEIGHT}px` }}
    >
      {HOURS.map((hour) => {
        const hh = String(hour).padStart(2, '0');
        return (
          <div key={hour}>
            <DroppableCell
              id={`cell-${dayOfWeek}-${hour}-0`}
              isHour
              onClick={() => onCellClick(dayOfWeek, `${hh}:00`)}
            />
            <DroppableCell
              id={`cell-${dayOfWeek}-${hour}-30`}
              isHour={false}
              onClick={() => onCellClick(dayOfWeek, `${hh}:30`)}
            />
          </div>
        );
      })}
      {schedules.map((s) => (
        <ScheduleBlock key={s.id} schedule={s} onClick={onScheduleClick} />
      ))}
    </div>
  );
}
