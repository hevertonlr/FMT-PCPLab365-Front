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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ValidationStyleDirective,
    AlertComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  bgimg: string = `assets/images/backgrounds/bg${Math.floor(
    Math.random() * 5 + 1,
  )}.jpg`;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    public validationService: ValidationService,
    private alertService: AlertService,
    private storageService: StorageService,
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

  onSubmit(): void {
    if (this.form.invalid) {
      const alertProperties = this.validationService.getAlertProperties(
        this.form,
      );
      this.alertService.showAlert(
        'error',
        alertProperties.alertMessage,
        alertProperties.alertErrors,
      );
      return;
    }
    this.alertService.hideAlert();
    const { email, password, rememberMe } = this.form.value;
    rememberMe ? this.remember() : this.forget();
    this.authService.login(email, password).subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        this.alertService.showAlert('success', 'Usuário logado com Sucesso!');
        this.router.navigate(['/home']);
        return;
      }
      this.alertService.showAlert('error', 'Usuário e/ou senha incorretos');
    });
  }

  notImplemented = () =>
    this.alertService.showAlert('info', 'Funcionalidade não implementada!');

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
