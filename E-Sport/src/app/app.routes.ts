import { Routes } from '@angular/router';
import { ClassificaComponent } from './pages/classifica/classifica.component';
import { HomeComponent } from './pages/home/home.component';
import { LiveComponent } from './pages/live/live.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrazioneComponent } from './pages/registrazione/registrazione.component';
import { TopTorneiComponent } from './pages/top-tornei/top-tornei.component';
import { TorneoComponent } from './pages/torneo/torneo.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, data: { tipo: 'aperti' }, title: 'Tornei aperti · ArenaHub' },
  {
    path: 'tornei-chiusi',
    component: HomeComponent,
    data: { tipo: 'chiusi' },
    title: 'Tornei chiusi · ArenaHub',
  },
  { path: 'tornei/:id', component: TorneoComponent, title: 'Dettaglio torneo · ArenaHub' },
  { path: 'top-tornei', component: TopTorneiComponent, title: 'Top tornei · ArenaHub' },
  { path: 'live', component: LiveComponent, title: 'Live · ArenaHub' },
  {
    path: 'classifica',
    component: ClassificaComponent,
    data: { tipo: 'generale' },
    title: 'Classifica generale · ArenaHub',
  },
  {
    path: 'classifica/categoria',
    component: ClassificaComponent,
    data: { tipo: 'categoria' },
    title: 'Classifica per categoria · ArenaHub',
  },
  {
    path: 'classifica/top',
    component: ClassificaComponent,
    data: { tipo: 'top' },
    title: 'Classifica top · ArenaHub',
  },
  { path: 'login', component: LoginComponent, title: 'Accedi · ArenaHub' },
  { path: 'registrazione', component: RegistrazioneComponent, title: 'Registrati · ArenaHub' },
  { path: '**', redirectTo: '' },
];
