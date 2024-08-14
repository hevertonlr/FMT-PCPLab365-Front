import { Gender } from '../enums/gender';
import { Address } from './address';
import { SchoolClass } from './schoolclass';

export interface Student {
  id: string;
  name: string;
  gender: Gender;
  birthday: Date;
  cpf: string;
  rg: string;
  phone: string;
  email?: string;
  password: string;
  placeofbirth: string;
  address?: Address;
  image: string;
  class: SchoolClass[];
}
