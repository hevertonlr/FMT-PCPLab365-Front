import { CivilState } from '../enums/civilstate';
import { Gender } from '../enums/gender';
import { SchoolSubject } from '../enums/schoolsubject';
import { Address } from './address';

export interface Teacher {
  id: string;
  name: string;
  gender: Gender;
  birthday: Date;
  cpf: string;
  rg: string;
  civilState: CivilState;
  phone: string;
  email: string;
  password: string;
  nationality: string;
  address: Address;
  schoolSubjects: SchoolSubject[];
}
