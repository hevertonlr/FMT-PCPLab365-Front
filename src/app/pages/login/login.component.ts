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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  bgimg: string = `assets/img/backgrounds/bg${Math.floor(
    Math.random() * 5 + 1
  )}.jpg`;
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.logout();
    this.form = this.formBuilder.group({
      email: [
        sessionStorage.getItem('email') ?? '',
        [Validators.required, Validators.email],
      ],
      password: [sessionStorage.getItem('password') ?? '', Validators.required],
      rememberMe: [sessionStorage.getItem('rememberMe')],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      // Swal.fire('Atenção!', 'Revise todos os campos!', 'warning');
      return;
    }
    const { email, password, rememberMe } = this.form.value;
    rememberMe ? this.remember() : this.forget();
    this.authService.login(email, password).subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        console.log('User logged in successfully!');
        this.router.navigate(['/home']);
      } else {
        console.log('Invalid credentials or login failed.');
        // Swal.fire('Erro!', 'Usuário inválido!', 'error');
      }
    });
  }

  private remember = () => {
    const { email, password, rememberMe } = this.form.value;
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('password', password);
    sessionStorage.setItem('rememberMe', rememberMe);
  };
  private forget = () => {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('password');
    sessionStorage.removeItem('rememberMe');
  };
}
