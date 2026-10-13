import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
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
  { path: 'login', component: LoginComponent, title: 'Accedi · ArenaHub' },
  { path: 'registrazione', component: RegistrazioneComponent, title: 'Registrati · ArenaHub' },
  { path: '**', redirectTo: '' },
];
