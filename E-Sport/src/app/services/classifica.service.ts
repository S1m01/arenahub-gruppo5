import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { classificaGeneraleDemo } from '../data/tornei-demo';
import { PosizioneClassifica } from '../models/torneo.model';
import { conRiserva } from './con-riserva';

@Injectable({ providedIn: 'root' })
export class ClassificaService {
  private http = inject(HttpClient);

  getGenerale(): Observable<PosizioneClassifica[]> {
    return conRiserva(this.http.get<PosizioneClassifica[]>('/api/classifica'), () =>
      classificaGeneraleDemo()
    );
  }

  getTop(): Observable<PosizioneClassifica[]> {
    return conRiserva(this.http.get<PosizioneClassifica[]>('/api/classifica/top'), () =>
      classificaGeneraleDemo().slice(0, 3)
    );
  }

  getPerCategoria(categoria: string): Observable<PosizioneClassifica[]> {
    const percorso = encodeURIComponent(categoria.toLowerCase());
    return conRiserva(
      this.http.get<PosizioneClassifica[]>(`/api/classifica/categorie/${percorso}`),
      () => classificaGeneraleDemo(categoria)
    );
  }
}
