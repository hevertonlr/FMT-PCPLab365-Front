import { Teacher } from './teacher';

export interface SchoolClass {
  id: string;
  name: string;
  initialDate: Date;
  endDate: Date;
  classSchedule: string;
  teacher: Teacher;
}
