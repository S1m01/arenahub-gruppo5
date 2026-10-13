import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import {
  TORNEI_DEMO,
  categorieDemo,
  classificaDemo,
  classificaGiocatoriDemo,
  partiteDemo,
  squadreDemo,
} from '../data/tornei-demo';
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
    return this.conRiserva(this.http.get<Torneo[]>('/api/tornei', { params }), () =>
      TORNEI_DEMO.filter((t) => t.stato !== 'CONCLUSO')
    );
  }

  getTorneiConclusi(): Observable<Torneo[]> {
    const params = new HttpParams().set('stato', 'concluso');
    return this.conRiserva(this.http.get<Torneo[]>('/api/tornei', { params }), () =>
      TORNEI_DEMO.filter((t) => t.stato === 'CONCLUSO')
    );
  }

  getCategorie(): Observable<Categoria[]> {
    return this.conRiserva(this.http.get<Categoria[]>('/api/categorie'), categorieDemo);
  }

  getTorneo(id: number): Observable<TorneoDettaglio> {
    return this.conRiserva(this.http.get<TorneoDettaglio>(`/api/tornei/${id}`), () => {
      const torneo = TORNEI_DEMO.find((t) => t.id === id);
      if (!torneo) {
        throw new HttpErrorResponse({ status: 404, error: { errore: 'Torneo non trovato' } });
      }
      return torneo;
    });
  }

  getSquadre(id: number): Observable<Squadra[]> {
    return this.conRiserva(this.http.get<Squadra[]>(`/api/tornei/${id}/squadre`), () =>
      squadreDemo(id)
    );
  }

  getPartite(id: number): Observable<Partita[]> {
    return this.conRiserva(this.http.get<Partita[]>(`/api/tornei/${id}/partite`), () =>
      partiteDemo(id)
    );
  }

  getClassifica(id: number): Observable<PosizioneSquadra[]> {
    return this.conRiserva(
      this.http.get<PosizioneSquadra[]>(`/api/tornei/${id}/classifica`),
      () => classificaDemo(id)
    );
  }

  getClassificaGiocatori(id: number): Observable<PosizioneGiocatore[]> {
    return this.conRiserva(
      this.http.get<PosizioneGiocatore[]>(`/api/tornei/${id}/classifica-giocatori`),
      () => classificaGiocatoriDemo(id)
    );
  }

  iscriviti(id: number): Observable<unknown> {
    return this.http.post(`/api/tornei/${id}/iscrizioni`, {});
  }

  private conRiserva<T>(richiesta: Observable<T>, riserva: () => T): Observable<T> {
    return richiesta.pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status !== 0 && err.status < 500) {
          return throwError(() => err);
        }
        try {
          return of(riserva());
        } catch (errRiserva) {
          return throwError(() => errRiserva);
        }
      })
    );
  }
}
