import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PartitaApi, TorneoApi } from '../models/api.model';
import {
  Partita,
  PosizioneGiocatore,
  PosizioneSquadra,
  Squadra,
  Torneo,
  TorneoDettaglio,
} from '../models/torneo.model';
import { daPartitaApi, daTorneoApi } from './mappa-api';

@Injectable({ providedIn: 'root' })
export class TorneiService {
  private http = inject(HttpClient);

  getTorneiNonConclusi(): Observable<Torneo[]> {
    return this.elenco(new HttpParams().set('stato', 'aperto,chiuso'));
  }

  getTorneiConclusi(): Observable<Torneo[]> {
    return this.elenco(new HttpParams().set('stato', 'concluso'));
  }

  getTorneiLive(): Observable<Torneo[]> {
    return this.http
      .get<TorneoApi[]>('/api/tornei/live')
      .pipe(map((lista) => lista.map((t) => ({ ...daTorneoApi(t), inCorso: true }))));
  }

  getTopTornei(): Observable<Torneo[]> {
    return this.http
      .get<TorneoApi[]>('/api/tornei/top')
      .pipe(map((lista) => lista.map((t) => daTorneoApi(t))));
  }

  getCategorie(): Observable<string[]> {
    return this.http.get<string[]>('/api/categorie');
  }

  getTorneo(id: number): Observable<TorneoDettaglio> {
    return this.http.get<TorneoApi>(`/api/tornei/${id}`).pipe(map((t) => daTorneoApi(t)));
  }

  getSquadre(id: number): Observable<Squadra[]> {
    return this.http.get<Squadra[]>(`/api/tornei/${id}/squadre`);
  }

  getPartite(id: number): Observable<Partita[]> {
    return this.http
      .get<PartitaApi[]>(`/api/tornei/${id}/partite`)
      .pipe(map((lista) => lista.map(daPartitaApi)));
  }

  getClassifica(id: number): Observable<PosizioneSquadra[]> {
    return this.http.get<PosizioneSquadra[]>(`/api/tornei/${id}/classifica`);
  }

  getClassificaGiocatori(id: number): Observable<PosizioneGiocatore[]> {
    return this.http.get<PosizioneGiocatore[]>(`/api/tornei/${id}/classifica-giocatori`);
  }

  iscriviti(id: number): Observable<unknown> {
    return this.http.post(`/api/tornei/${id}/iscrizioni`, {});
  }

  private elenco(params: HttpParams): Observable<Torneo[]> {
    return this.http
      .get<TorneoApi[]>('/api/tornei', { params })
      .pipe(map((lista) => lista.map((t) => daTorneoApi(t))));
  }
}
