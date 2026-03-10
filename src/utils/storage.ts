import type { Schedule } from '../types/schedule';

const KEY = 'weekly-schedules';

export function loadSchedules(): Schedule[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Schedule[]) : [];
  } catch {
    return [];
  }
}

export function saveSchedules(schedules: Schedule[]): void {
  localStorage.setItem(KEY, JSON.stringify(schedules));
}
