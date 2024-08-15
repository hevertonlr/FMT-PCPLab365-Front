export interface Address {
  id: string;
  cep: string;
  city: string;
  state: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  referencePoint?: string;
}
