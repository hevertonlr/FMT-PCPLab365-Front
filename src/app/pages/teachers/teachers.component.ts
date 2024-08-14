import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPencilMini, heroTrashMini } from '@ng-icons/heroicons/mini';
import {
  heroEye,
  heroPencil,
  heroPencilSquare,
  heroTrash,
} from '@ng-icons/heroicons/outline';
import { heroPencilSolid, heroTrashSolid } from '@ng-icons/heroicons/solid';
import { Teacher } from 'app/shared/interfaces/teacher';
import { TeacherService } from 'app/shared/services/teacher.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIconComponent],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.scss',
  providers: [
    provideIcons({
      heroTrash,
      heroTrashSolid,
      heroTrashMini,
      heroPencil,
      heroPencilSquare,
      heroPencilMini,
      heroEye,
    }),
  ],
})
export class TeachersComponent {
  searchInput: string = '';
  teachers!: Observable<Teacher[]>;
  filteredTeachers!: Observable<Teacher[]>;

  constructor(
    private router: Router,
    private service: TeacherService,
  ) {
    this.teachers = this.service.getAll();
    this.filteredTeachers = this.teachers;
  }

  onSearch = () => {
    if (!this.searchInput) {
      this.filteredTeachers = this.teachers;
      return;
    }
    let filterWords = this.searchInput.toLocaleLowerCase();
    this.filteredTeachers = this.teachers.pipe(
      map((teachers) =>
        teachers.filter(
          (teacher) =>
            teacher.id === filterWords ||
            teacher.name.toLowerCase().includes(filterWords) ||
            teacher.email.toLowerCase().includes(filterWords),
        ),
      ),
    );
  };
  onEdit(teacher: Teacher): void {
    this.router.navigate(['/teacher'], { state: { teacher } });
  }
}
