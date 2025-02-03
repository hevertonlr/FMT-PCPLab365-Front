import { SchoolClass } from "./schoolclass";
import { Teacher } from "./teacher";

export interface SchoolSubject {
  id: string;
  name: string;
  classrooms: SchoolClass[];
  teachers: Teacher[];
}
