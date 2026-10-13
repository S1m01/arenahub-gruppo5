import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TORNEI_DEMO,
  categorieDemo,
  classificaDemo,
  classificaGiocatoriDemo,
  partiteDemo,
  squadreDemo,
} from '../data/tornei-demo';
import { conRiserva } from './con-riserva';
import {
  Categoria,
  Partita,
  PosizioneGiocatore,
  PosizioneSquadra,
  Squadra,
  Torneo,
  TorneoDettaglio,
} from '../models/torneo.model';

@Injectable({ providedIn: 'root' })
export class TorneiService {
  private http = inject(HttpClient);

  getTorneiNonConclusi(): Observable<Torneo[]> {
    const params = new HttpParams().set('stato', 'aperto,chiuso');
    return conRiserva(this.http.get<Torneo[]>('/api/tornei', { params }), () =>
      TORNEI_DEMO.filter((t) => t.stato !== 'CONCLUSO')
    );
  }

  getTorneiConclusi(): Observable<Torneo[]> {
    const params = new HttpParams().set('stato', 'concluso');
    return conRiserva(this.http.get<Torneo[]>('/api/tornei', { params }), () =>
      TORNEI_DEMO.filter((t) => t.stato === 'CONCLUSO')
    );
  }

  getTorneiLive(): Observable<Torneo[]> {
    return conRiserva(this.http.get<Torneo[]>('/api/tornei/live'), () =>
      TORNEI_DEMO.filter((t) => t.inCorso && t.stato !== 'CONCLUSO')
    );
  }

  getTopTornei(): Observable<Torneo[]> {
    return conRiserva(this.http.get<Torneo[]>('/api/tornei/top'), () =>
      [...TORNEI_DEMO].sort((a, b) => b.iscritti - a.iscritti).slice(0, 3)
    );
  }

  getCategorie(): Observable<Categoria[]> {
    return conRiserva(this.http.get<Categoria[]>('/api/categorie'), categorieDemo);
  }

  getTorneo(id: number): Observable<TorneoDettaglio> {
    return conRiserva(this.http.get<TorneoDettaglio>(`/api/tornei/${id}`), () => {
      const torneo = TORNEI_DEMO.find((t) => t.id === id);
      if (!torneo) {
        throw new HttpErrorResponse({ status: 404, error: { errore: 'Torneo non trovato' } });
      }
      return torneo;
    });
  }

  getSquadre(id: number): Observable<Squadra[]> {
    return conRiserva(this.http.get<Squadra[]>(`/api/tornei/${id}/squadre`), () =>
      squadreDemo(id)
    );
  }

  getPartite(id: number): Observable<Partita[]> {
    return conRiserva(this.http.get<Partita[]>(`/api/tornei/${id}/partite`), () =>
      partiteDemo(id)
    );
  }

  getClassifica(id: number): Observable<PosizioneSquadra[]> {
    return conRiserva(
      this.http.get<PosizioneSquadra[]>(`/api/tornei/${id}/classifica`),
      () => classificaDemo(id)
    );
  }

  getClassificaGiocatori(id: number): Observable<PosizioneGiocatore[]> {
    return conRiserva(
      this.http.get<PosizioneGiocatore[]>(`/api/tornei/${id}/classifica-giocatori`),
      () => classificaGiocatoriDemo(id)
    );
  }

  iscriviti(id: number): Observable<unknown> {
    return this.http.post(`/api/tornei/${id}/iscrizioni`, {});
  }
}
