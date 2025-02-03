import { CivilState } from '../enums/civilstate';
import { SchoolSubject } from '../enums/schoolsubject';
import { Person } from './person';
import { User } from './user';

export interface Teacher extends Person {
  civilState: CivilState;
  nationality: string;
  schoolSubjects: SchoolSubject[];
  user: User;
}
