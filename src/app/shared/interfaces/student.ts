import { Gender } from '../enums/gender';
import { Address } from './address';

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
  nationality: string;
  address?: Address;
  image: string;
  class: string[];
}

// Nome Completo: Obrigatório, com máximo e mínimo de 64 e 8 caracteres, respectivamente.
// Gênero: Obrigatório com dropdown de opções pré-definidas.
// Data de Nascimento: Obrigatório, data válida.
// CPF: Obrigatório com o formato 000.000.000-00
// RG com órgão expedidor: Obrigatório, com máximo de 20 caracteres.
// Telefone: Obrigatório com o formato (99) 9 9999-99999
// E-mail: Não obrigatório e com validação.
// Senha: Obrigatório sendo no mínimo 8 caracteres.
// Naturalidade: Obrigatório, com máximo e mínimo de 64 e 8 caracteres, respectivamente.
// Endereço: Cep, Cidade, Estado, Logradouro, Número, Complemento, Bairro e Ponto de Referência.
// Turma: Obrigatório, campo multi-select (pode receber mais de uma seleção) com a listagem de turmas cadastradas no portal.
