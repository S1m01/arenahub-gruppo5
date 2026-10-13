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

/**
 * Risposta di POST /api/auth/login.
 * Adattala a quello che restituisce il backend (es. solo token, oppure token + utente).
 */
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

  /** POST /api/auth/login — errori: 400 dati non validi, 401 credenziali errate */
  login(dati: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('/api/auth/login', dati)
      .pipe(tap((risposta) => this.salvaSessione(risposta)));
  }

  /**
   * POST /api/auth/registrazione — errori: 400 dati non validi, 409 email già in uso.
   * Il backend apre già la sessione: dopo la registrazione l'utente risulta loggato.
   */
  registrazione(dati: RegistrazioneRequest): Observable<Utente> {
    return this.http
      .post<Utente>('/api/auth/registrazione', dati)
      .pipe(tap((utente) => this.salvaSessione({ utente })));
  }

  private salvaSessione(sessione: LoginResponse): void {
    this.sessione.set(sessione);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessione));
    } catch {
      /* storage non disponibile: la sessione resta solo in memoria */
    }
  }

  logout(): void {
    this.sessione.set(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignora */
    }
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
