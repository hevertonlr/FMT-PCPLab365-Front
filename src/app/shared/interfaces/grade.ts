import { SchoolSubject } from '../enums/schoolsubject';
import { Student } from './student';
import { Teacher } from './teacher';

export interface Grade {
  id: string;
  testname: string;
  testdate: Date;
  testgrade: number;
  teacher: Teacher;
  student: Student;
  schoolSubject: SchoolSubject;
}
