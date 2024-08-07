import { Routes, TitleStrategy } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { GradesComponent } from './pages/grades/grades.component';
import { StudentsComponent } from './pages/students/students.component';
import { SchoolClassesComponent } from './pages/schoolclasses/schoolclasses.component';
import { TeachersComponent } from './pages/teachers/teachers.component';
import { TeachersListComponent } from './pages/teachers-list/teachers-list.component';
import { GradesListComponent } from './pages/grades-list/grades-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
    data: { name: 'Login', icon: 'login' },
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Dashboard',
    data: { name: 'Dashboard', icon: 'home', breadcrumb: 'inicio' },
    canActivate: [AuthGuard],
  },
  {
    path: 'teacher',
    component: TeachersComponent,
    title: 'Cadastro de Docente',
    data: {
      name: 'Cadastro de Docente',
      icon: 'user-plus',
      breadcrumb: 'Docente',
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'student',
    component: StudentsComponent,
    title: 'Cadastro de Aluno',
    data: {
      name: 'Cadastro de Aluno',
      icon: 'user-circle',
      breadcrumb: 'Aluno',
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'schoolclasse',
    component: SchoolClassesComponent,
    title: 'Cadastro de Turma',
    data: {
      name: 'Cadastro de Turma',
      icon: 'folder-plus',
      breadcrumb: 'Turma',
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'grade',
    component: GradesComponent,
    title: 'Cadastro de Notas',
    data: {
      name: 'Cadastro de Notas',
      icon: 'arrow-trending-up',
      breadcrumb: 'Nota',
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'teachers',
    component: TeachersListComponent,
    title: 'Docentes',
    data: { name: 'Docentes', icon: 'user-group', breadcrumb: 'Docentes' },
    canActivate: [AuthGuard],
  },
  {
    path: 'grades',
    component: GradesListComponent,
    title: 'Notas',
    data: {
      name: 'Notas',
      icon: 'presentation-chart-line',
      breadcrumb: 'Avaliação/Nota',
    },
    canActivate: [AuthGuard],
  },
];
