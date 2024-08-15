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
import { Router } from '@angular/router';
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
import { Gender } from 'app/shared/enums/gender';
import { SchoolClass } from 'app/shared/interfaces/schoolclass';
import { Student } from 'app/shared/interfaces/student';
import { FormUtilsService } from 'app/shared/services/form-utils.service';
import SchoolClassService from 'app/shared/services/schoolclass.service';
import { StudentService } from 'app/shared/services/student.service';
import { ToastService } from 'app/shared/services/toast.service';
import { ValidationService } from 'app/shared/services/validation.service';
import { ViaCepService } from 'app/shared/services/via-cep.service';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-registration',
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
  imagePreview: string | ArrayBuffer | null = null;
  tabs: { label: string; icon: string }[] = [];
  genders: { key: string; value: string }[];
  fieldAliases: { [key: string]: string };
  schoolClasses: SchoolClass[] = [];
  isLoading: boolean = false;
  editObject: Student;
  form: FormGroup;
  selectedTab = 0;
  deleteEnable: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: StudentService,
    private toastService: ToastService,
    private viaCepService: ViaCepService,
    private formUtilsService: FormUtilsService,
    private validationService: ValidationService,
    private schoolclassService: SchoolClassService,
  ) {
    this.genders = this.formUtilsService.getAllGenders();
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
    this.fieldAliases = {
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
      image: 'Imagem do Perfil',
      class: 'Turma',
    };
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
  }
  ngOnInit(): void {
    this.deleteEnable = false;
    const state = history.state;
    if (state?.student) {
      this.deleteEnable = true;
      this.editObject = state?.student as Student;
      this.imagePreview = this.editObject.image;
      this.form.patchValue(this.editObject);
      this.formUtilsService.markAllAsDirty(this.form);
    }
  }

  onSubmit = () => {
    this.formUtilsService.enableAllFields(
      this.form.get('address') as FormGroup,
    );
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

  handleFileInput = (event: Event) => {
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
  };
  inputTransformFn = (value: unknown): string =>
    typeof value === 'string' ? value.toUpperCase() : String(value);

  outputTransformFn = (value: string | number | null | undefined): string =>
    value ? String(value).toUpperCase() : '';
  onDelete = (student: Student) => {
    Swal.fire({
      title: 'Confirma a exclusão deste Registro?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(student.id).subscribe(() => {
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
