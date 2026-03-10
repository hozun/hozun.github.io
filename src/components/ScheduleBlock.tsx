import { useDraggable } from '@dnd-kit/core';
import type { Schedule } from '../types/schedule';
import { getBlockHeight, getTopOffset } from '../utils/time';

interface Props {
  schedule: Schedule;
  onClick: (schedule: Schedule) => void;
}

export function ScheduleBlock({ schedule, onClick }: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: schedule.id,
    data: schedule,
  });

  const top = getTopOffset(schedule.startTime);
  const height = getBlockHeight(schedule.startTime, schedule.endTime);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();
        onClick(schedule);
      }}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: schedule.color,
        opacity: isDragging ? 0.25 : 1,
      }}
      className="absolute inset-x-0.5 rounded-md text-white text-[11px] px-1.5 py-0.5 overflow-hidden cursor-grab active:cursor-grabbing select-none z-10"
    >
      <div className="font-semibold truncate leading-tight">{schedule.title}</div>
      {height >= 44 && (
        <div className="opacity-75 text-[10px] leading-tight">
          {schedule.startTime}–{schedule.endTime}
        </div>
      )}
    </div>
  );
}
