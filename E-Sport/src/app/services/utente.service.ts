import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MiaPartitaApi, MioTorneoApi } from '../models/api.model';
import { MiaPartita, MioTorneo, Statistiche, UtenteCercato } from '../models/torneo.model';
import { Utente } from './auth.service';
import { daMiaPartitaApi, daMioTorneoApi } from './mappa-api';

@Injectable({ providedIn: 'root' })
export class UtenteService {
  private http = inject(HttpClient);

  getMe(): Observable<Utente> {
    return this.http.get<Utente>('/api/auth/me');
  }

  getStatistiche(): Observable<Statistiche> {
    return this.http.get<Statistiche>('/api/utenti/me/statistiche');
  }

  getMieiTornei(): Observable<MioTorneo[]> {
    return this.http
      .get<MioTorneoApi[]>('/api/utenti/me/tornei')
      .pipe(map((lista) => lista.map(daMioTorneoApi)));
  }

  getMiePartite(stato?: 'programmata' | 'conclusa'): Observable<MiaPartita[]> {
    let params = new HttpParams();
    if (stato) params = params.set('stato', stato);
    return this.http
      .get<MiaPartitaApi[]>('/api/utenti/me/partite', { params })
      .pipe(map((lista) => lista.map(daMiaPartitaApi)));
  }

  modificaProfilo(dati: { nome: string; cognome: string; email: string }): Observable<Utente> {
    return this.http.put<Utente>('/api/utenti/me', dati);
  }

  cambiaPassword(dati: { passwordAttuale: string; passwordNuova: string }): Observable<void> {
    return this.http.put<void>('/api/utenti/me/password', dati);
  }

  cerca(email: string): Observable<UtenteCercato> {
    return this.http.get<UtenteCercato>('/api/utenti/cerca', { params: { email } });
  }

  annullaIscrizione(torneoId: number): Observable<void> {
    return this.http.delete<void>(`/api/tornei/${torneoId}/iscrizioni`);
  }
}
