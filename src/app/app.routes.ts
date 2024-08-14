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
import { StudentRegistrationComponent } from './pages/student-registration/student-registration.component';
import { Profile } from './shared/enums/profile';

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
    canActivate: [AuthGuard],
    data: {
      name: 'Cadastro de Docente',
      icon: 'user-plus',
      breadcrumb: 'Docente',
      allowedProfiles: [Profile.Administrator],
    },
  },
  {
    path: 'student',
    component: StudentRegistrationComponent,
    title: 'Cadastro de Aluno',
    canActivate: [AuthGuard],
    data: {
      name: 'Cadastro de Aluno',
      icon: 'user-circle',
      breadcrumb: 'Aluno',
      allowedProfiles: [Profile.Administrator],
    },
  },
  {
    path: 'schoolclasse',
    component: SchoolClassesComponent,
    title: 'Cadastro de Turma',
    canActivate: [AuthGuard],
    data: {
      name: 'Cadastro de Turma',
      icon: 'folder-plus',
      breadcrumb: 'Turma',
      allowedProfiles: [Profile.Administrator, Profile.Teacher],
    },
  },
  {
    path: 'grade',
    component: GradesComponent,
    title: 'Cadastro de Notas',
    canActivate: [AuthGuard],
    data: {
      name: 'Cadastro de Notas',
      icon: 'arrow-trending-up',
      breadcrumb: 'Nota',
      allowedProfiles: [Profile.Administrator, Profile.Teacher],
    },
  },
  {
    path: 'teachers',
    component: TeachersListComponent,
    title: 'Docentes',
    canActivate: [AuthGuard],
    data: {
      name: 'Docentes',
      icon: 'user-group',
      breadcrumb: 'Docentes',
      allowedProfiles: [Profile.Administrator],
    },
  },
  {
    path: 'grades',
    component: GradesListComponent,
    title: 'Notas',
    canActivate: [AuthGuard],
    data: {
      name: 'Notas',
      icon: 'presentation-chart-line',
      breadcrumb: 'Avaliação/Nota',
      allowedProfiles: [Profile.Student],
    },
  },
];
