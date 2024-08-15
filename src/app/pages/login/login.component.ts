import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from 'app/shared/services/auth.service';
import { ValidationStyleDirective } from 'app/shared/directives/validation-style.directive';
import { AlertComponent } from 'app/shared/components/alert/alert.component';
import { ValidationService } from 'app/shared/services/validation.service';
import { AlertService } from 'app/shared/services/alert.service';
import { StorageService } from 'app/shared/services/storage.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

import {
  heroCheckCircleSolid,
  heroExclamationCircleSolid,
} from '@ng-icons/heroicons/solid';
import { ToastService } from 'app/shared/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ValidationStyleDirective,
    AlertComponent,
    NgIconComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [
    provideIcons({
      heroExclamationCircleSolid,
      heroCheckCircleSolid,
    }),
  ],
})
export class LoginComponent implements OnInit {
  bgimg: string = `assets/images/backgrounds/bg${Math.floor(
    Math.random() * 5 + 1,
  )}.jpg`;
  form: FormGroup;
  fieldAliases: { [key: string]: string } = {
    email: 'E-mail',
    password: 'Senha',
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private validationService: ValidationService,
    private alertService: AlertService,
    private storageService: StorageService,

    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.authService.logout();
    this.form = this.formBuilder.group({
      email: [
        sessionStorage.getItem('email') ?? '',
        [Validators.required, Validators.email],
      ],
      password: [
        sessionStorage.getItem('password') ?? '',
        [Validators.required, Validators.minLength(6)],
      ],
      rememberMe: [sessionStorage.getItem('rememberMe')],
    });
  }

  onSubmit = () => {
    if (this.form.invalid) {
      this.toastService.showToast(
        'error',
        'Erro',
        'Revise os campos e tente novamente!',
      );
      return;
    }

    const { email, password, rememberMe } = this.form.value;
    rememberMe ? this.remember() : this.forget();
    this.authService.login(email, password).subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        this.toastService.showToast(
          'success',
          'Sucesso!',
          'Usuário logado com Sucesso!',
        );
        this.router.navigate(['/home']);
        return;
      }
      this.toastService.showToast(
        'error',
        'Erro!',
        'Usuário e/ou senha incorretos',
      );
    });
  };

  notImplemented = () =>
    this.alertService.showAlert('info', 'Funcionalidade não implementada!');

  getInputErrors = (inputName: string) =>
    this.validationService.getControlErrors(
      this.form,
      inputName,
      this.fieldAliases,
    );

  isValid = (inputName: string) =>
    this.validationService.isValid(this.form, inputName);

  private remember = () => {
    const { email, password, rememberMe } = this.form.value;
    this.storageService.setMultipleSessionStorage([
      { key: 'email', value: email },
      { key: 'password', value: password },
      { key: 'rememberMe', value: rememberMe },
    ]);
  };
  private forget = () =>
    this.storageService.removeMultipleLocalStorage([
      'email',
      'password',
      'rememberMe',
    ]);
}
