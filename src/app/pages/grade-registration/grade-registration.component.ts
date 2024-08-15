import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroUsers,
  heroFolder,
  heroEnvelope,
  heroHomeModern,
  heroCog6Tooth,
  heroArrowTrendingUp,
} from '@ng-icons/heroicons/outline';
import {
  heroUserCircleSolid,
  heroCheckCircleSolid,
  heroExclamationCircleSolid,
} from '@ng-icons/heroicons/solid';
import { ValidationStyleDirective } from 'app/shared/directives/validation-style.directive';
import { Profile } from 'app/shared/enums/profile';
import { Grade } from 'app/shared/interfaces/grade';
import { Student } from 'app/shared/interfaces/student';
import { Teacher } from 'app/shared/interfaces/teacher';
import { User } from 'app/shared/interfaces/user';
import { AuthService } from 'app/shared/services/auth.service';
import { FormUtilsService } from 'app/shared/services/form-utils.service';
import { GradeService } from 'app/shared/services/grade.service';
import { StudentService } from 'app/shared/services/student.service';
import { TeacherService } from 'app/shared/services/teacher.service';
import { ToastService } from 'app/shared/services/toast.service';
import { ValidationService } from 'app/shared/services/validation.service';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grade-registration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgIconComponent,
    ValidationStyleDirective,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  templateUrl: './grade-registration.component.html',
  styleUrl: './grade-registration.component.scss',
  providers: [
    provideIcons({
      heroUsers,
      heroFolder,
      heroArrowTrendingUp,
      heroEnvelope,
      heroHomeModern,
      heroCog6Tooth,
      heroUserCircleSolid,
      heroCheckCircleSolid,
      heroExclamationCircleSolid,
    }),
  ],
})
export class GradeRegistrationComponent {
  schoolSubjects: { key: string; value: string }[];
  civilStates: { key: string; value: string }[];
  tabs: { label: string; icon: string }[] = [];
  genders: { key: string; value: string }[];
  fieldAliases: { [key: string]: string };
  students: Student[] = [];
  teachers: Teacher[] = [];
  currentUser: User;
  today: string;

  isLoading: boolean = false;
  editObject: Grade;
  form: FormGroup;
  selectedTab = 0;
  deleteEnable: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: GradeService,
    private toastService: ToastService,
    private formUtilsService: FormUtilsService,
    private validationService: ValidationService,
    private teachersService: TeacherService,
    private studentsService: StudentService,
    private authService: AuthService,
  ) {
    this.today = formatDate(Date.now(), 'yyyy-MM-dd', 'en-US');
    this.genders = this.formUtilsService.getAllGenders();
    this.civilStates = this.formUtilsService.getAllCivilStates();
    this.schoolSubjects = this.formUtilsService.getAllSchoolSubjects();
    this.currentUser = this.authService.getCurrentUser();
    const observable =
      this.currentUser.profile === Profile.Administrator
        ? this.teachersService.getAll()
        : this.teachersService.findBy('email', this.currentUser.email);
    (observable as Observable<Teacher | Teacher[]>).subscribe({
      next: (data: Teacher | Teacher[]) => {
        this.teachers = Array.isArray(data) ? data : [data];
      },
      error: (error) => {
        this.toastService.showToast(
          'error',
          'Erro!',
          'Ocorreu um erro ao buscar os Professores',
        );
        console.error('Teacher fetching error:', error);
      },
    });

    this.studentsService.getAll().subscribe({
      next: (data) => {
        this.students = data;
      },
      error: (error) => {
        this.toastService.showToast(
          'error',
          'Erro!',
          'Ocorreu um erro ao buscar os Alunos',
        );
        console.error('Student fetching error:', error);
      },
    });

    this.fieldAliases = {
      teacher: 'Professor',
      schoolSubject: 'Matéria',
      student: 'Aluno',
      testname: 'Nome da Avaliação',
      testdate: 'Data da Avaliação',
      testgrade: 'Nota da Avaliação',
    };
    this.tabs = [
      {
        label: 'Nota',
        icon: 'heroArrowTrendingUp',
      },
    ];

    this.form = this.fb.group({
      id: [''],
      teacher: [
        { value: '', disabled: this.currentUser.profile === Profile.Teacher },
        Validators.required,
      ],
      schoolSubject: ['', Validators.required],
      student: ['', Validators.required],
      testname: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
        ],
      ],
      testdate: [
        formatDate(Date.now(), 'yyyy-MM-dd', 'en-US'),
        Validators.required,
      ],
      testgrade: [
        '',
        [Validators.required, Validators.min(0), Validators.max(10)],
      ],
    });
  }
  ngOnInit(): void {
    this.deleteEnable = false;
    const state = history.state;
    if (state?.grade) {
      this.deleteEnable = true;
      this.editObject = state?.grade as Grade;
      this.form.patchValue(this.editObject);
      this.formUtilsService.markAllAsDirty(this.form);
    }
  }
  onSubmit = () => {
    this.formUtilsService.enableAllFields(this.form);

    if (this.form.invalid) {
      this.toastService.showToast(
        'warning',
        'Atenção!',
        'Revise o formulário!',
      );
      this.formUtilsService.markAllAsDirty(this.form);
      if (this.currentUser.profile === Profile.Teacher)
        this.formUtilsService.disableAllFields(this.form, ['teacher']);
      return;
    }
    try {
      if (this.form.get('id')?.value !== '') {
        this.service
          .update(this.form.get('id')?.value, this.form.value)
          .subscribe((data) => {
            this.toastService.showToast(
              'success',
              'Successo!',
              'Registro atualizado com sucesso.',
            );
          });
      } else {
        delete this.form.value.id;
        this.service.create(this.form.value).subscribe((data) => {
          this.toastService.showToast(
            'success',
            'Successo!',
            'Registro criado com sucesso.',
          );
        });
        this.form.reset();
      }
    } catch (error) {
      console.error('Form submit error:', error);
      this.toastService.showToast(
        'error',
        'Erro!',
        'Ocorreu um erro ao manipular o Registro',
      );
    }
    if (this.currentUser.profile === Profile.Teacher)
      this.formUtilsService.disableAllFields(this.form, ['teacher']);
  };

  getInputErrors = (inputName: string) =>
    this.validationService.getControlErrors(
      this.form,
      inputName,
      this.fieldAliases,
    );
  selectTab = (tabIndex: number) => (this.selectedTab = tabIndex);
  isActive = (tabIndex: number) => this.selectedTab === tabIndex;
  isValid = (inputName: string) =>
    this.validationService.isValid(this.form, inputName);
  onDelete = (item: Grade) => {
    Swal.fire({
      title: 'Confirma a exclusão deste Registro?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(item.id).subscribe(() => {
          Swal.fire(
            'Excluido!',
            'Registro excluído com sucesso',
            'success',
          ).then(() => {
            this.form.reset();
            this.router.navigate(['/home']);
          });
        });
      }
    });
  };
}
