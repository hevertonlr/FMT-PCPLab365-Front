import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from 'app/shared/components/alert/alert.component';
import { Profile } from 'app/shared/enums/profile';
import { Student } from 'app/shared/interfaces/student';
import { User } from 'app/shared/interfaces/user';
import { AuthService } from 'app/shared/services/auth.service';
import SchoolClassService from 'app/shared/services/schoolclass.service';
import { SearchService } from 'app/shared/services/search.service';
import { StudentService } from 'app/shared/services/student.service';
import { TeacherService } from 'app/shared/services/teacher.service';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AlertComponent, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  students!: Observable<Student[]>;
  filteredStudents!: Observable<Student[]>;
  studentsCount: number;
  teachersCount: number;
  schoolclassCount: number;
  filterText: string = '';
  searchText: string = '';
  constructor(
    private studentService: StudentService,
    private teacherService: TeacherService,
    private schoolclassService: SchoolClassService,
    private searchService: SearchService,
    private authService: AuthService,
  ) {}
  ngOnInit(): void {
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
  }

  getStudentTitle = (): string => {
    const { profile } =
      this.authService.getTokenContent<User>() ?? ({} as User);
    if (profile == Profile.Student) return '';
    return profile == Profile.Administrator ? 'Ver Mais' : 'Lançar Nota';
  };

  onSearch = () => {
    this.searchService.updateSearchTerm(this.searchText);
  };
}
