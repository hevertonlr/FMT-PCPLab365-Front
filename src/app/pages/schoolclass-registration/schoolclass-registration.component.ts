import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  heroEnvelope,
  heroHomeModern,
  heroCog6Tooth,
  heroFolder,
} from '@ng-icons/heroicons/outline';
import {
  heroUserCircleSolid,
  heroCheckCircleSolid,
  heroExclamationCircleSolid,
} from '@ng-icons/heroicons/solid';
import { ValidationStyleDirective } from 'app/shared/directives/validation-style.directive';
import { Profile } from 'app/shared/enums/profile';
import { SchoolClass } from 'app/shared/interfaces/schoolclass';
import { Teacher } from 'app/shared/interfaces/teacher';
import { User } from 'app/shared/interfaces/user';
import { AuthService } from 'app/shared/services/auth.service';
import { FormUtilsService } from 'app/shared/services/form-utils.service';
import SchoolClassService from 'app/shared/services/schoolclass.service';
import { TeacherService } from 'app/shared/services/teacher.service';
import { ToastService } from 'app/shared/services/toast.service';
import { ValidationService } from 'app/shared/services/validation.service';
import { ViaCepService } from 'app/shared/services/via-cep.service';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-schoolclass-registration',
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
  templateUrl: './schoolclass-registration.component.html',
  styleUrl: './schoolclass-registration.component.scss',
  providers: [
    provideIcons({
      heroUsers,
      heroFolder,
      heroEnvelope,
      heroHomeModern,
      heroCog6Tooth,
      heroUserCircleSolid,
      heroCheckCircleSolid,
      heroExclamationCircleSolid,
    }),
  ],
})
export class SchoolClassRegistrationComponent implements OnInit {
  tabs: { label: string; icon: string }[] = [];
  fieldAliases: { [key: string]: string };
  teachers: Teacher[] = [];
  currentUser: User;

  isLoading: boolean = false;
  editObject: SchoolClass;
  form: FormGroup;
  selectedTab = 0;
  deleteEnable: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: SchoolClassService,
    private toastService: ToastService,
    private formUtilsService: FormUtilsService,
    private validationService: ValidationService,
    private teachersService: TeacherService,
    private authService: AuthService,
  ) {
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
          'Ocorreu um erro ao buscar as Turmas',
        );
        console.error('SchoolClass fetching error:', error);
      },
    });

    this.fieldAliases = {
      name: 'Nome',
      initialDate: 'Data de Início',
      endDate: 'Data de Término',
      classSchedule: 'Horário da Turma',
      teacher: 'Professor',
    };
    this.tabs = [
      {
        label: 'Turma',
        icon: 'heroFolder',
      },
    ];

    this.form = this.fb.group({
      id: [''],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
        ],
      ],
      initialDate: ['', Validators.required],
      endDate: ['', Validators.required],
      classSchedule: ['', Validators.required],
      teacher: [
        { value: '', disabled: this.currentUser.profile === Profile.Teacher },
        Validators.required,
      ],
    });
  }
  ngOnInit(): void {
    this.deleteEnable = false;
    const state = history.state;
    if (state?.schoolclass) {
      this.deleteEnable = true;
      this.editObject = state?.schoolclass as SchoolClass;
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
  onDelete = (item: SchoolClass) => {
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
