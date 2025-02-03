export enum Gender {
  Male = 'Masculino',
  Female = 'Feminino',
  NonBinary = 'Não-Binário',
  Genderqueer = 'Gênero Queer',
  Genderfluid = 'Gênero Fluido',
  Agender = 'Agênero',
  Bigender = 'Bigênero',
  TwoSpirit = 'Dois Espíritos',
  Other = 'Outro',
}
export function mapGender(gender: string): Gender {
  switch (gender) {
    case 'MALE':
      return Gender.Male;
    case 'FEMALE':
      return Gender.Female;
    case 'NON_BINARY':
      return Gender.NonBinary;
    case 'GENDERQUEER':
      return Gender.Genderqueer;
    case 'GENDERFLUID':
      return Gender.Genderfluid;
    case 'AGENDER':	
      return Gender.Agender;
    case 'BIGENDER':
      return Gender.Bigender;
    case 'TWO_SPIRIT':
      return Gender.TwoSpirit;
    case 'OTHER':
      return Gender.Other;
    default:
      throw new Error(`Unknown gender: ${gender}`);
  }
}