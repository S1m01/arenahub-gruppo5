import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { giocateDemo } from '../data/tornei-demo';
import { Giocata } from '../models/torneo.model';
import { conRiserva } from './con-riserva';

@Injectable({ providedIn: 'root' })
export class GiocateService {
  private http = inject(HttpClient);

  getGiocate(torneoId?: number): Observable<Giocata[]> {
    const params = torneoId === undefined ? undefined : new HttpParams().set('torneoId', torneoId);
    return conRiserva(this.http.get<Giocata[]>('/api/giocate', { params }), () =>
      giocateDemo(torneoId)
    );
  }
}
