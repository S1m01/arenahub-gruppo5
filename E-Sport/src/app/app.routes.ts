import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { ClassificaComponent } from './pages/classifica/classifica.component';
import { GestioneTorneiComponent } from './pages/gestione-tornei/gestione-tornei.component';
import { HomeComponent } from './pages/home/home.component';
import { IscrittiComponent } from './pages/iscritti/iscritti.component';
import { LiveComponent } from './pages/live/live.component';
import { LoginComponent } from './pages/login/login.component';
import { PartiteComponent } from './pages/partite/partite.component';
import { RegistrazioneComponent } from './pages/registrazione/registrazione.component';
import { TopGiocateComponent } from './pages/top-giocate/top-giocate.component';
import { TopTorneiComponent } from './pages/top-tornei/top-tornei.component';
import { TorneoFormComponent } from './pages/torneo-form/torneo-form.component';
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
  { path: 'top-giocate', component: TopGiocateComponent, title: 'Top giocate · ArenaHub' },
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
  {
    path: 'admin',
    component: GestioneTorneiComponent,
    canActivate: [adminGuard],
    title: 'Gestione tornei · ArenaHub',
  },
  {
    path: 'admin/tornei/nuovo',
    component: TorneoFormComponent,
    canActivate: [adminGuard],
    title: 'Nuovo torneo · ArenaHub',
  },
  {
    path: 'admin/tornei/:id/modifica',
    component: TorneoFormComponent,
    canActivate: [adminGuard],
    title: 'Modifica torneo · ArenaHub',
  },
  {
    path: 'admin/tornei/:id/iscritti',
    component: IscrittiComponent,
    canActivate: [adminGuard],
    title: 'Iscritti · ArenaHub',
  },
  {
    path: 'admin/tornei/:id/partite',
    component: PartiteComponent,
    canActivate: [adminGuard],
    title: 'Partite · ArenaHub',
  },
  { path: '**', redirectTo: '' },
];
