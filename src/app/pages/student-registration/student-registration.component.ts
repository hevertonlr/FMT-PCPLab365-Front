import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
  heroCog6Tooth,
  heroEnvelope,
  heroHomeModern,
  heroIdentification,
  heroUsers,
} from '@ng-icons/heroicons/outline';
import {
  heroCheckCircleSolid,
  heroExclamationCircleSolid,
  heroUserCircleSolid,
} from '@ng-icons/heroicons/solid';
import { AlertComponent } from 'app/shared/components/alert/alert.component';
import { ValidationStyleDirective } from 'app/shared/directives/validation-style.directive';
import { Gender } from 'app/shared/enums/gender';
import { SchoolClass } from 'app/shared/interfaces/schoolclass';
import { Student } from 'app/shared/interfaces/student';
import SchoolClassService from 'app/shared/services/schoolclass.service';
import { StudentService } from 'app/shared/services/student.service';
import { ToastService } from 'app/shared/services/toast.service';
import { ValidationService } from 'app/shared/services/validation.service';
import { ViaCepService } from 'app/shared/services/via-cep.service';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-student-registration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgIconComponent,
    ValidationStyleDirective,
    AlertComponent,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  templateUrl: './student-registration.component.html',
  styleUrl: './student-registration.component.scss',
  providers: [
    provideIcons({
      heroUsers,
      heroIdentification,
      heroEnvelope,
      heroHomeModern,
      heroCog6Tooth,
      heroUserCircleSolid,
      heroCheckCircleSolid,
      heroExclamationCircleSolid,
    }),
  ],
})
export class StudentRegistrationComponent implements OnInit {
  form: FormGroup;
  selectedTab = 0;
  editObject: Student;
  tabs: { label: string; icon: string }[] = [];
  genders = Gender;
  genderKeys: { key: string; value: string }[];
  imagePreview: string | ArrayBuffer | null = null;
  isLoading: boolean = false;
  schoolClasses: SchoolClass[] = [];
  fileToUpload: File | null = null;
  fieldAliases: { [key: string]: string } = {
    name: 'Nome',
    gender: 'Gênero',
    birthday: 'Data de Nascimento',
    cpf: 'CPF',
    rg: 'RG',
    phone: 'Telefone',
    email: 'E-mail',
    password: 'Senha',
    placeofbirth: 'Naturalidade',
    'address.cep': 'CEP',
    'address.city': 'Cidade',
    'address.uf': 'UF',
    'address.street': 'Endereço',
    'address.complement': 'Complemento',
    'address.neighborhood': 'Bairro',
    'address.referencePoint': 'Ponto de Referência',
    class: 'Turma',
  };

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private studentService: StudentService,
    private schoolclassService: SchoolClassService,
    private viaCepService: ViaCepService,
    private toastService: ToastService,
  ) {
    this.genderKeys = Object.keys(this.genders).map((key) => ({
      key,
      value: this.genders[key as keyof typeof Gender],
    }));
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
      gender: ['', Validators.required],
      birthday: ['', Validators.required],
      cpf: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(\d{3})(\d{3})(\d{3})(\d{2})$/),
        ],
      ],
      rg: ['', [Validators.required, Validators.maxLength(20)]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(\d{2})\D*(\d{5}|\d{4})\D*(\d{4})$/),
        ],
      ],
      email: ['', Validators.email],
      password: ['', [Validators.required, Validators.minLength(8)]],
      placeofbirth: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
        ],
      ],
      address: this.fb.group({
        cep: ['', Validators.required],
        city: [{ value: '', disabled: true }],
        state: [{ value: '', disabled: true }],
        street: [{ value: '', disabled: true }],
        number: [''],
        complement: [''],
        neighborhood: [{ value: '', disabled: true }],
        referencePoint: [''],
      }),
      image: ['', Validators.required],
      class: [[], Validators.required],
    });
    this.tabs = [
      {
        label: 'Perfil',
        icon: 'heroIdentification',
      },
      {
        label: 'Endereço',
        icon: 'heroHomeModern',
      },
      {
        label: 'Configurações',
        icon: 'heroCog6Tooth',
      },
    ];
    this.schoolclassService.getAll().subscribe({
      next: (data) => {
        this.schoolClasses = data;
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
  }
  ngOnInit(): void {
    const state = history.state;
    if (state?.student) {
      this.editObject = state?.student as Student;
      this.imagePreview = this.editObject.image;
      this.form.patchValue(this.editObject);
      this.markAllAsDirty();
    }
  }
  selectTab(tabIndex: number) {
    this.selectedTab = tabIndex;
  }
  isActive = (tabIndex: number) => this.selectedTab === tabIndex;

  getInputErrors = (inputName: string) =>
    this.validationService.getControlErrors(
      this.form,
      inputName,
      this.fieldAliases,
    );
  isValid = (inputName: string) =>
    this.validationService.isValid(this.form, inputName);

  onSubmit = () => {
    this.enableAllFields();
    if (this.form.invalid) {
      this.toastService.showToast(
        'warning',
        'Atenção!',
        'Revise o formulário!',
      );
      this.markAllAsDirty();
      this.disableAllFields();
      return;
    }
    try {
      if (this.form.get('id')?.value !== '') {
        this.studentService
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
        this.studentService.create(this.form.value).subscribe((data) => {
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
    this.disableAllFields();
  };
  enableAllFields = () =>
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach((subKey) => {
          control.get(subKey)?.enable();
        });
      } else {
        control?.enable();
      }
    });

  disableAllFields = () =>
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach((subKey) => {
          control.get(subKey)?.disable();
        });
      } else {
        control?.disable();
      }
    });

  findCep = () => {
    const cep = this.form.get('address.cep')?.value;
    if (!cep) return;
    this.isLoading = true;
    this.viaCepService.getAddress(cep).subscribe({
      next: (data) => {
        this.form.get('address')?.patchValue(data);
        this.setReadOnly();
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

  setReadOnly = () => {
    const addressGroup = this.form.get('address') as FormGroup;
    Object.keys(addressGroup.controls).forEach((field) => {
      const control = addressGroup.get(field);
      if (field === 'cep' || field === 'referencePoint') return;

      control?.value ? control?.disable() : control?.enable();
    });
  };

  isFieldBlocked = (field: string): boolean =>
    this.form.get('address')?.get(field)?.disabled || false;

  handleFileInput(event: Event) {
    const file = (event.target as HTMLInputElement).files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.form.get('image')?.setValue(reader.result?.toString());
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreview = null;
    }
  }
  public inputTransformFn = (value: unknown): string =>
    typeof value === 'string' ? value.toUpperCase() : String(value);

  public outputTransformFn = (
    value: string | number | null | undefined,
  ): string => (value ? String(value).toUpperCase() : '');

  private markAllAsDirty() {
    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      if (control?.hasValidator(Validators.required)) {
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
        control.updateValueAndValidity();
      }
    });
  }
}
