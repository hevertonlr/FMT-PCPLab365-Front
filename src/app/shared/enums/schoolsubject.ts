export enum SchoolSubject {
  Mathematics = 'Matemática',
  History = 'História',
  Chemistry = 'Química',
  Physics = 'Física',
  English = 'Inglês',
  Geography = 'Geografia',
  Biology = 'Biologia',
  Portuguese = 'Português',
  Literature = 'Literatura',
  Philosophy = 'Filosofia',
  Sociology = 'Sociologia',
  PhysicalEducation = 'Educação Física',
  Arts = 'Artes',
  Spanish = 'Espanhol',
  ComputerScience = 'Informática',
  Technology = 'Tecnologia',
  Science = 'Ciências',
  Music = 'Música',
  Theater = 'Teatro',
}
export function mapSchoolSubject(subject: string): SchoolSubject {
  switch (subject) {
    case 'MATHEMATICS':
      return SchoolSubject.Mathematics;
    case 'HISTORY':
      return SchoolSubject.History;
    case 'CHEMISTRY':
      return SchoolSubject.Chemistry;
    case 'PHYSICS':
      return SchoolSubject.Physics;
    case 'ENGLISH':
      return SchoolSubject.English;
    case 'GEOGRAPHY':
      return SchoolSubject.Geography;
    case 'BIOLOGY':
      return SchoolSubject.Biology;
    case 'PORTUGUESE':
      return SchoolSubject.Portuguese;
    case 'LITERATURE':
      return SchoolSubject.Literature;
    case 'PHILOSOPHY':
      return SchoolSubject.Philosophy;
    case 'SOCIOLOGY':
      return SchoolSubject.Sociology;
    case 'PHYSICAL_EDUCATION':
      return SchoolSubject.PhysicalEducation;
    case 'ARTS':
      return SchoolSubject.Arts;
    case 'SPANISH':
      return SchoolSubject.Spanish;
    case 'COMPUTER_SCIENCE':
      return SchoolSubject.ComputerScience;
    case 'TECHNOLOGY':
      return SchoolSubject.Technology;
    case 'SCIENCE':
      return SchoolSubject.Science;
    case 'MUSIC':
      return SchoolSubject.Music;
    case 'THEATER':
      return SchoolSubject.Theater;
    default:
      throw new Error(`Unknown school subject: ${subject}`);
  }
}
