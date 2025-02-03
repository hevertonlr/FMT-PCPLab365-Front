export enum CivilState {
  Single = 'Solteiro(a)',
  Married = 'Casado(a)',
  Divorced = 'Divorciado(a)',
  Widowed = 'Viúvo(a)',
  Separated = 'Separado(a)',
}
export function mapCivilState(civilstate: string): CivilState {
  switch (civilstate) {
    case 'SINGLE':  return CivilState.Single;
    case 'MARRIED': return CivilState.Married;
    case 'DIVORCED': return CivilState.Divorced;
    case 'WIDOWED': return CivilState.Widowed;
    case 'SEPARATED': return CivilState.Separated; 
    default:
      throw new Error(`Unknown civil state: ${civilstate}`);
  }
}