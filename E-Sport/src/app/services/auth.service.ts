import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistrazioneRequest {
  nome: string;
  cognome: string;
  email: string;
  password: string;
}

export interface Utente {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  ruolo: 'UTENTE' | 'ADMIN';
}

export interface LoginResponse {
  token?: string;
  utente?: Utente;
}

const STORAGE_KEY = 'arenahub_sessione';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private sessione = signal<LoginResponse | null>(this.leggiSessione());

  readonly utente = computed(() => this.sessione()?.utente ?? null);
  readonly loggato = computed(() => this.sessione() !== null);
  readonly token = computed(() => this.sessione()?.token ?? null);

  login(dati: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('/api/auth/login', dati)
      .pipe(tap((risposta) => this.salvaSessione(risposta)));
  }

  registrazione(dati: RegistrazioneRequest): Observable<Utente> {
    return this.http
      .post<Utente>('/api/auth/registrazione', dati)
      .pipe(tap((utente) => this.salvaSessione({ utente })));
  }

  private salvaSessione(sessione: LoginResponse): void {
    this.sessione.set(sessione);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessione));
    } catch {}
  }

  logout(): void {
    this.sessione.set(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  private leggiSessione(): LoginResponse | null {
    try {
      const salvata = localStorage.getItem(STORAGE_KEY);
      return salvata ? (JSON.parse(salvata) as LoginResponse) : null;
    } catch {
      return null;
    }
  }
}
