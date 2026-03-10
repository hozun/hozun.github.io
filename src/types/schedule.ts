// 0=월, 1=화, 2=수, 3=목, 4=금, 5=토, 6=일
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Schedule {
  id: string;
  groupId?: string; // 다중 요일 등록 시 같은 그룹끼리 공유
  title: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:MM" 24시간 형식
  endTime: string;   // "HH:MM" 24시간 형식
  color: string;
}
