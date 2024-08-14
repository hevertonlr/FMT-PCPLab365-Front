import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertComponent } from 'app/shared/components/alert/alert.component';
import { Profile } from 'app/shared/enums/profile';
import { Grade } from 'app/shared/interfaces/grade';
import { Student } from 'app/shared/interfaces/student';
import { User } from 'app/shared/interfaces/user';
import { AuthService } from 'app/shared/services/auth.service';
import { GradeService } from 'app/shared/services/grade.service';
import SchoolClassService from 'app/shared/services/schoolclass.service';
import { SearchService } from 'app/shared/services/search.service';
import { StudentService } from 'app/shared/services/student.service';
import { TeacherService } from 'app/shared/services/teacher.service';
import { map, Observable, switchMap } from 'rxjs';
interface Subject {
  name: string;
  description: string;
}
interface ExtraCourse {
  name: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AlertComponent, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  filteredStudents!: Observable<Student[]>;
  students!: Observable<Student[]>;
  grades!: Observable<Grade[]>;
  schoolclassCount: number;
  filterText: string = '';
  searchText: string = '';
  studentsCount: number;
  teachersCount: number;
  profile: Profile;

  currentSubjects: Subject[] = [
    { name: 'Disciplina A', description: 'Descrição da disciplina A' },
    { name: 'Disciplina B', description: 'Descrição da disciplina B' },
    { name: 'Disciplina C', description: 'Descrição da disciplina C' },
  ];

  extraCourses: ExtraCourse[] = [
    { name: 'Curso Extra 1', description: 'Descrição do curso extra 1' },
    { name: 'Curso Extra 2', description: 'Descrição do curso extra 2' },
    { name: 'Curso Extra 3', description: 'Descrição do curso extra 3' },
  ];

  constructor(
    private router: Router,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private schoolclassService: SchoolClassService,
    private searchService: SearchService,
    private authService: AuthService,
    private gradeService: GradeService,
  ) {}
  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.profile = currentUser?.profile;
    this.students = this.studentService.getAll();
    this.studentService.getCount().subscribe((count) => {
      this.studentsCount = count;
    });
    this.teacherService.getCount().subscribe((count) => {
      this.teachersCount = count;
    });
    this.schoolclassService.getCount().subscribe((count) => {
      this.schoolclassCount = count;
    });
    this.filteredStudents = this.searchService.currentSearchTerm.pipe(
      switchMap((term) => {
        this.filterText = term == '' ? 'Todos os Produtos' : term;
        return this.students.pipe(
          map((students) =>
            students.filter((student) =>
              student.name.toLowerCase().includes(term.toLowerCase()),
            ),
          ),
        );
      }),
    );
    if (!this.isAdmin()) {
      this.studentService
        .getAllBy('email', currentUser.email)
        .subscribe((student) => {
          this.grades = this.gradeService.getAllBy('student', student[0].id);
        });
    }
  }

  getStudentTitle = (): string => {
    const { profile } =
      this.authService.getTokenContent<User>() ?? ({} as User);
    if (profile == Profile.Student) return '';
    return profile == Profile.Administrator ? 'Ver Mais' : 'Lançar Nota';
  };

  onSearch = () => this.searchService.updateSearchTerm(this.searchText);

  edit = (student: Student) =>
    this.router.navigate(['/student'], { state: { student } });
  editGrade = (grade: Grade) =>
    this.router.navigate(['/grades'], { state: { grade } });

  isAdmin = () => this.profile !== Profile.Student;
}
