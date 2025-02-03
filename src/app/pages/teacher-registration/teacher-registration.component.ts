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
import { NgIconComponent } from '@ng-icons/core';
import { ValidationStyleDirective } from 'app/shared/directives/validation-style.directive';
import { Teacher } from 'app/shared/interfaces/teacher';
import { FormUtilsService } from 'app/shared/services/form-utils.service';
import { TeacherService } from 'app/shared/services/teacher.service';
import { ToastService } from 'app/shared/services/toast.service';
import { ValidationService } from 'app/shared/services/validation.service';
import { ViaCepService } from 'app/shared/services/via-cep.service';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { map, Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { Tools } from 'app/shared/utils/tools';
import { SchoolsubjectService } from 'app/shared/services/schoolsubject.service';
import { SchoolSubject } from 'app/shared/interfaces/schoolsubject';
import { DateFormatPipe } from 'app/shared/pipes/dateformat.pipe';

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
    DateFormatPipe,
  ],
  templateUrl: './teacher-registration.component.html',
  styleUrl: './teacher-registration.component.scss',
})
export class TeacherRegistrationComponent implements OnInit {
  imagePreview: string | ArrayBuffer | null = null;
  // subjects: { key: string; value: string }[];
  subjects: Observable<SchoolSubject[]>;
  civilStates: { key: string; value: string }[];
  tabs: { label: string; icon: string }[] = [];
  genders: { key: string; value: string }[];
  fieldAliases: { [key: string]: string };

  isLoading: boolean = false;
  editObject: Teacher;
  form: FormGroup;
  selectedTab = 0;
  deleteEnable: boolean = false;
  private dateFormatPipe = new DateFormatPipe();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: TeacherService,
    private toastService: ToastService,
    private viaCepService: ViaCepService,
    private formUtilsService: FormUtilsService,
    private validationService: ValidationService,
    private subjectService: SchoolsubjectService,
  ) {
    this.genders = this.formUtilsService.getAllGenders();
    this.civilStates = this.formUtilsService.getAllCivilStates();
    // this.subjects = this.formUtilsService.getAllSchoolSubjects();
    this.subjects = this.subjectService.getAll();

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
      nationality: 'Naturalidade',
      'address.cep': 'CEP',
      'address.city': 'Cidade',
      'address.uf': 'UF',
      'address.street': 'Endereço',
      'address.complement': 'Complemento',
      'address.neighborhood': 'Bairro',
      'address.referencePoint': 'Ponto de Referência',
      'user.username': 'Usuário',
      'user.name': 'Nome',
      'user.email': 'E-mail',
      'user.password': 'Senha',
      class: 'Turma',
      subjects: 'Matérias',
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
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      rg: ['', [Validators.required, Validators.maxLength(20)]],
      civilState: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      user: this.fb.group({
        id: [''],
        username: ['', Validators.required],
        name: [''],
        email: ['', Validators.email],
        password: ['', [Validators.required, Validators.minLength(8)]],
        image: [''],
      }),
      nationality: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          Validators.maxLength(64),
        ],
      ],
      address: this.fb.group({
        id: [''],
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
      subjects: [[]],
    });
  }
  ngOnInit(): void {
    this.deleteEnable = false;
    const state = history.state;
    if (state?.teacher) {
      this.deleteEnable = true;
      this.editObject = state?.teacher as Teacher;
      // this.imagePreview = this.editObject.image;
      this.form.patchValue(this.editObject);
      this.formUtilsService.markAllAsDirty(this.form);
      this.editValidators();
    }
    this.onChanges();
  }

  onChanges = () =>
    this.form.get('name')?.valueChanges.subscribe((val) => {
      const usernameField = this.form.get('user.username');
      if (usernameField?.value === '') {
        usernameField?.setValue(Tools.generateSlug(val), { emitEvent: false });
      }
      const nameField = this.form.get('user.name');
      if (nameField?.value === '') {
        nameField?.setValue(val, { emitEvent: false });
      }
    });

  onSubmit = () => {
    this.formUtilsService.getFormValidationErrors(this.form);
    this.formUtilsService.enableAllFields(this.form);
    if (this.form.invalid) {
      console.log(this.form);
      this.toastService.showToast(
        'warning',
        'Atenção!',
        'Revise o formulário!',
      );
      console.log(
        this.validationService.getErrorMessages(this.form, this.fieldAliases),
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
    const birthdayControl = this.form.get('birthday');
    if (birthdayControl) {
      const formattedDate = this.dateFormatPipe.transform(
        birthdayControl.value,
      );
      birthdayControl.setValue(formattedDate);
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
            this.form.reset();
          });
      } else {
        delete this.form.value.id;
        this.service.create(this.form.value).subscribe((data) => {
          this.toastService.showToast(
            'success',
            'Successo!',
            'Registro criado com sucesso.',
          );
          this.form.reset();
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
  changeTab = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    this.selectedTab = Number(target.value);
  };
  selectTab = (tabIndex: number) => (this.selectedTab = tabIndex);
  isActive = (tabIndex: number) => this.selectedTab === tabIndex;
  nextTab = () =>
    this.selectedTab < this.tabs.length - 1
      ? (this.selectedTab += 1)
      : this.onSubmit();

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

  onDelete = (teacher: Teacher) => {
    Swal.fire({
      title: 'Confirma a exclusão deste Docente?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(teacher.id).subscribe(() => {
          Swal.fire(
            'Excluido!',
            'Docente excluído com sucesso',
            'success',
          ).then(() => {
            this.form.reset();
            this.router.navigate(['/home']);
          });
        });
      }
    });
  };

  handleFileInput = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.form.get('user.image')?.setValue(reader.result?.toString());
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

  editValidators = () => {
    if (this.editObject != null) {
      this.form.get('user.password')?.clearValidators();
      // this.form.get('user.password')?.setValidators([Validators.email]);

      // Update validity after changing validators
      this.form.get('user.password')?.updateValueAndValidity();
      // this.form.get('email')?.updateValueAndValidity();
    }
  };
}
