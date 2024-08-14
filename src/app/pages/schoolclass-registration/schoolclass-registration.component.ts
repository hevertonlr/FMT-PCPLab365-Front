import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroUsers,
  heroIdentification,
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
  schoolSubjects: { key: string; value: string }[];
  civilStates: { key: string; value: string }[];
  tabs: { label: string; icon: string }[] = [];
  genders: { key: string; value: string }[];
  fieldAliases: { [key: string]: string };
  teachers: Teacher[] = [];
  currentUser: User;

  isLoading: boolean = false;
  editObject: SchoolClass;
  form: FormGroup;
  selectedTab = 0;

  constructor(
    private fb: FormBuilder,
    private service: SchoolClassService,
    private toastService: ToastService,
    private viaCepService: ViaCepService,
    private formUtilsService: FormUtilsService,
    private validationService: ValidationService,
    private teachersService: TeacherService,
    private authService: AuthService,
  ) {
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
    const state = history.state;
    if (state?.schoolclass) {
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
  isFieldBlocked = (field: string): boolean =>
    this.form.get('address')?.get(field)?.disabled || false;

  findCep = () => {
    const cep = this.form.get('address.cep')?.value;
    if (!cep) return;
    this.isLoading = true;
    this.viaCepService.getAddress(cep).subscribe({
      next: (data) => {
        this.form.get('address')?.patchValue(data);
        this.formUtilsService.setReadOnly(this.form);
        this.isLoading = false;
      },
      error: (error) => {
        if (error?.status == 404) {
          this.toastService.showToast(
            'warning',
            'Atenção!',
            'CEP não encontrado!',
          );
        } else {
          this.toastService.showToast(
            'error',
            'Erro!',
            'Ocorreu um erro ao buscar o CEP',
          );
          console.error('CEP fetching error:', error);
        }
        this.isLoading = false;
      },
    });
  };

  // handleFileInput = (event: Event) => {
  //   const file = (event.target as HTMLInputElement).files?.item(0);
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.imagePreview = reader.result;
  //       this.form.get('image')?.setValue(reader.result?.toString());
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     this.imagePreview = null;
  //   }
  // }

  inputTransformFn = (value: unknown): string =>
    typeof value === 'string' ? value.toUpperCase() : String(value);

  outputTransformFn = (value: string | number | null | undefined): string =>
    value ? String(value).toUpperCase() : '';
}
