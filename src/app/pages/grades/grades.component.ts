import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Grade } from 'app/shared/interfaces/grade';
import { SchoolClass } from 'app/shared/interfaces/schoolclass';
import { Student } from 'app/shared/interfaces/student';
import { Teacher } from 'app/shared/interfaces/teacher';
import { AuthService } from 'app/shared/services/auth.service';
import { GradeService } from 'app/shared/services/grade.service';
import SchoolClassService from 'app/shared/services/schoolclass.service';
import { StudentService } from 'app/shared/services/student.service';
import { TeacherService } from 'app/shared/services/teacher.service';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.scss',
})
export class GradesComponent {
  searchInput: string = '';
  grades: Observable<Grade[]>;
  currentStudent: Student;
  schoolClasses: SchoolClass[];

  constructor(
    private service: GradeService,
    private authService: AuthService,
    private studentService: StudentService,
    private teacherService: TeacherService,
    public schoolClassService: SchoolClassService,
  ) {
    const currentUser = this.authService.getCurrentUser();
    this.schoolClassService
      .getAll()
      .subscribe((schoolclass) => (this.schoolClasses = schoolclass));

    this.studentService
      .getAllBy('email', currentUser.email)
      .subscribe((student) => {
        this.currentStudent = student[0];
        this.grades = this.service.getAllBy('student', this.currentStudent.id);
      });

    this.service.getAllBy('student', this.currentStudent?.id).pipe(
      switchMap((grades: Grade[]) => {
        const teachersIds = grades.map((grade) => grade.teacher.id);
        return this.teacherService.getAllByIds(teachersIds).pipe(
          map((teachers: Teacher[]) =>
            grades.map((grade) => {
              grade.teacher =
                teachers.find((c) => c.id === grade.teacher.id) ||
                ({} as Teacher);
              return { ...grade };
            }),
          ),
        );
      }),
    );
  }
}
