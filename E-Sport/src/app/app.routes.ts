import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrazioneComponent } from './pages/registrazione/registrazione.component';

export const routes: Routes = [
  // La stessa pagina elenco serve sia i tornei aperti (home) sia i tornei chiusi
  { path: '', component: HomeComponent, data: { tipo: 'aperti' }, title: 'Tornei aperti · ArenaHub' },
  {
    path: 'tornei-chiusi',
    component: HomeComponent,
    data: { tipo: 'chiusi' },
    title: 'Tornei chiusi · ArenaHub',
  },
  { path: 'login', component: LoginComponent, title: 'Login · ArenaHub' },
  { path: 'registrazione', component: RegistrazioneComponent, title: 'Registrati · ArenaHub' },
  { path: '**', redirectTo: '' },
];
