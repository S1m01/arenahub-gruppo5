import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IscrittiSquadraApi, TorneoApi, TorneoRichiestaApi } from '../models/api.model';
import { Torneo, TorneoDettaglio } from '../models/torneo.model';
import { daTorneoApi } from './mappa-api';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);

  getTuttiITornei(): Observable<Torneo[]> {
    return this.http
      .get<TorneoApi[]>('/api/tornei')
      .pipe(map((lista) => lista.map((t) => daTorneoApi(t))));
  }

  creaTorneo(dati: TorneoRichiestaApi): Observable<TorneoDettaglio> {
    return this.http.post<TorneoApi>('/api/tornei', dati).pipe(map((t) => daTorneoApi(t)));
  }

  modificaTorneo(id: number, dati: TorneoRichiestaApi): Observable<TorneoDettaglio> {
    return this.http.put<TorneoApi>(`/api/tornei/${id}`, dati).pipe(map((t) => daTorneoApi(t)));
  }

  getIscritti(id: number): Observable<IscrittiSquadraApi[]> {
    return this.http.get<IscrittiSquadraApi[]>(`/api/tornei/${id}/iscritti`);
  }

  cambiaStato(id: number, stato: 'chiuso' | 'concluso'): Observable<{ id: number; stato: string }> {
    return this.http.patch<{ id: number; stato: string }>(`/api/tornei/${id}/stato`, { stato });
  }
}

export function messaggioErrore(err: HttpErrorResponse, predefinito = 'Operazione non riuscita'): string {
  if (err.status === 0 || err.status >= 500) return 'Errore di connessione al server. Riprova.';
  if (err.status === 401) return 'Sessione scaduta: accedi di nuovo.';
  return err.error?.errore ?? predefinito;
}
