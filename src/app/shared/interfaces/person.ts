import { Gender } from "../enums/gender";
import { Address } from "./address";

export interface Person {
  id: string;
  name: string;
  gender: Gender;
  birthday: Date;
  cpf: string;
  rg: string;
  phone: string;
  email: string;
  address: Address;
}
