import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    data: { name: 'Login', icon: 'login' },
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { name: 'Home', icon: 'home' },
    canActivate: [AuthGuard],
  },
];
