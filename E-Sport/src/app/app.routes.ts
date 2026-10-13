import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Tornei aperti · ArenaHub' },
  { path: 'login', component: LoginComponent, title: 'Login · ArenaHub' },
  { path: '**', redirectTo: '' },
];
