import { Person } from './person';
import { SchoolClass } from './schoolclass';
import { User } from './user';

export interface Student extends Person{
  placeofbirth: string;
  classroom: SchoolClass[];
  user: User;
}
