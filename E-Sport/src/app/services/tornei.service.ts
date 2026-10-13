import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria, Torneo } from '../models/torneo.model';

@Injectable({ providedIn: 'root' })
export class TorneiService {
  private http = inject(HttpClient);

  /** GET /api/tornei?stato=aperto,chiuso — tornei non conclusi (quelli in corso hanno inCorso = true) */
  getTorneiNonConclusi(): Observable<Torneo[]> {
    const params = new HttpParams().set('stato', 'aperto,chiuso');
    return this.http.get<Torneo[]>('/api/tornei', { params });
  }

  /** GET /api/tornei?stato=concluso — archivio dei tornei finiti (pagina "Tornei chiusi") */
  getTorneiConclusi(): Observable<Torneo[]> {
    const params = new HttpParams().set('stato', 'concluso');
    return this.http.get<Torneo[]>('/api/tornei', { params });
  }

  /** GET /api/categorie */
  getCategorie(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>('/api/categorie');
  }
}
