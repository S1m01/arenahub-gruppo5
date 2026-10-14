import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GiocataApi } from '../models/api.model';
import { Giocata } from '../models/torneo.model';
import { daGiocataApi } from './mappa-api';

@Injectable({ providedIn: 'root' })
export class GiocateService {
  private http = inject(HttpClient);

  getGiocate(torneoId?: number, categoria?: string): Observable<Giocata[]> {
    let params = new HttpParams();
    if (torneoId !== undefined) params = params.set('torneoId', torneoId);
    if (categoria !== undefined) params = params.set('categoria', categoria);
    return this.http
      .get<GiocataApi[]>('/api/giocate', { params })
      .pipe(map((lista) => lista.map(daGiocataApi)));
  }
}
