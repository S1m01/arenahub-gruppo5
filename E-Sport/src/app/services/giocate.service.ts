import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GiocataApi } from '../models/api.model';
import { Giocata } from '../models/torneo.model';
import { daGiocataApi } from './mappa-api';

@Injectable({ providedIn: 'root' })
export class GiocateService {
  private http = inject(HttpClient);

  getGiocate(torneoId?: number): Observable<Giocata[]> {
    const params = torneoId === undefined ? undefined : new HttpParams().set('torneoId', torneoId);
    return this.http
      .get<GiocataApi[]>('/api/giocate', { params })
      .pipe(map((lista) => lista.map(daGiocataApi)));
  }
}
