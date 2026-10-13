import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PosizioneClassifica } from '../models/torneo.model';

@Injectable({ providedIn: 'root' })
export class ClassificaService {
  private http = inject(HttpClient);

  getGenerale(): Observable<PosizioneClassifica[]> {
    return this.http.get<PosizioneClassifica[]>('/api/classifica');
  }

  getTop(): Observable<PosizioneClassifica[]> {
    return this.http.get<PosizioneClassifica[]>('/api/classifica/top');
  }

  getPerCategoria(categoria: string): Observable<PosizioneClassifica[]> {
    const percorso = encodeURIComponent(categoria.toLowerCase());
    return this.http.get<PosizioneClassifica[]>(`/api/classifica/categorie/${percorso}`);
  }
}
