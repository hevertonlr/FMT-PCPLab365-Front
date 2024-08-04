import { Routes, TitleStrategy } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
    data: { name: 'Login', icon: 'login', breadcrumb: 'login' },
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Dashboard',
    data: { name: 'Dashboard', icon: 'home', breadcrumb: 'inicio' },
    canActivate: [AuthGuard],
  },
];
