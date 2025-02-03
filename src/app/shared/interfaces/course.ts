import { SchoolClass } from "./schoolclass";
import { SchoolSubject } from "./schoolsubject";

export interface Course{
    id: string;
    name: string;
    classrooms: SchoolClass[];
    subjects: SchoolSubject[];
}