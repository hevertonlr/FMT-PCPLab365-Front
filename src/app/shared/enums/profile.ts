export enum Profile {
  Administrator = 'Administrator',
  Teacher = 'Teacher',
  Student = 'Student',
}
export function mapProfile(profile: string): Profile {
  switch (profile) {
    case 'ADMINISTRATOR':
      return Profile.Administrator;
    case 'PEDAGOGICO':
    case 'RECRUITER':
    case 'PROFESSOR':
      return Profile.Teacher;
    case 'ALUNO':
      return Profile.Student;
    default:
      throw new Error(`Unknown profile: ${profile}`);
  }
}