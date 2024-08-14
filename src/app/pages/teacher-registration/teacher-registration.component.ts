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
import { ValidationStyleDirective } from 'app/shared/directives/validation-style.directive';
import { SchoolClass } from 'app/shared/interfaces/schoolclass';
import { Teacher } from 'app/shared/interfaces/teacher';
import { FormUtilsService } from 'app/shared/services/form-utils.service';
import SchoolClassService from 'app/shared/services/schoolclass.service';
import { TeacherService } from 'app/shared/services/teacher.service';
import { ToastService } from 'app/shared/services/toast.service';
import { ValidationService } from 'app/shared/services/validation.service';
import { ViaCepService } from 'app/shared/services/via-cep.service';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-teacher-registration',
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
  templateUrl: './teacher-registration.component.html',
  styleUrl: './teacher-registration.component.scss',
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
export class TeacherRegistrationComponent implements OnInit {
  // imagePreview: string | ArrayBuffer | null = null;
  schoolSubjects: { key: string; value: string }[];
  civilStates: { key: string; value: string }[];
  tabs: { label: string; icon: string }[] = [];
  genders: { key: string; value: string }[];
  fieldAliases: { [key: string]: string };

  isLoading: boolean = false;
  editObject: Teacher;
  form: FormGroup;
  selectedTab = 0;

  constructor(
    private fb: FormBuilder,
    private service: TeacherService,
    private toastService: ToastService,
    private viaCepService: ViaCepService,
    private formUtilsService: FormUtilsService,
    private validationService: ValidationService,
  ) {
    this.genders = this.formUtilsService.getAllGenders();
    this.civilStates = this.formUtilsService.getAllCivilStates();
    this.schoolSubjects = this.formUtilsService.getAllSchoolSubjects();

    this.fieldAliases = {
      name: 'Nome',
      gender: 'Gênero',
      birthday: 'Data de Nascimento',
      cpf: 'CPF',
      rg: 'RG',
      civilState: 'Estado Civil',
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
      civilState: ['', Validators.required],
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
      // image: ['', Validators.required],
      schoolSubjects: [[], Validators.required],
    });
  }
  ngOnInit(): void {
    const state = history.state;
    if (state?.teacher) {
      this.editObject = state?.teacher as Teacher;
      // this.imagePreview = this.editObject.image;
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
      this.formUtilsService.disableAllFields(this.form, [
        'uf',
        'city',
        'state',
        'street',
        'neighborhood',
      ]);
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
    this.formUtilsService.disableAllFields(this.form, [
      'uf',
      'city',
      'state',
      'street',
      'neighborhood',
    ]);
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
