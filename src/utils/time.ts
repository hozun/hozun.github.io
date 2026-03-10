export const START_HOUR = 9;
export const END_HOUR = 21;
export const SLOT_HEIGHT = 32; // px per 30 minutes
export const HOUR_HEIGHT = SLOT_HEIGHT * 2;
export const TOTAL_HEIGHT = (END_HOUR - START_HOUR) * 2 * SLOT_HEIGHT;

export const DAYS_KO = ['월', '화', '수', '목', '금', '토', '일'];

export const SCHEDULE_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
];

export const HOURS = Array.from(
  { length: END_HOUR - START_HOUR },
  (_, i) => START_HOUR + i,
);

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function getTopOffset(time: string): number {
  const minutes = timeToMinutes(time);
  const startMinutes = START_HOUR * 60;
  return ((minutes - startMinutes) / 30) * SLOT_HEIGHT;
}

export function getBlockHeight(startTime: string, endTime: string): number {
  const duration = timeToMinutes(endTime) - timeToMinutes(startTime);
  return Math.max((duration / 30) * SLOT_HEIGHT, SLOT_HEIGHT);
}

export function getDurationMinutes(startTime: string, endTime: string): number {
  return timeToMinutes(endTime) - timeToMinutes(startTime);
}

/** "cell-{dayOfWeek}-{hour}-{minute}" → { dayOfWeek, time } */
export function parseCellId(cellId: string): { dayOfWeek: number; time: string } {
  const [, day, hour, minute] = cellId.split('-').map(Number);
  return { dayOfWeek: day, time: minutesToTime(hour * 60 + minute) };
}

/** JS getDay() (0=일) → 앱 dayOfWeek (0=월) */
export function todayDayOfWeek(): number {
  return (new Date().getDay() + 6) % 7;
}
