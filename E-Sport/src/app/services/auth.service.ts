import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, finalize, map, of, tap } from 'rxjs';

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
  email?: string;
  ruolo: 'utente' | 'admin';
}

const STORAGE_KEY = 'arenahub_utente';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private utenteCorrente = signal<Utente | null>(this.leggiUtente());

  readonly utente = this.utenteCorrente.asReadonly();
  readonly loggato = computed(() => this.utenteCorrente() !== null);
  readonly admin = computed(() => this.utenteCorrente()?.ruolo === 'admin');

  login(dati: LoginRequest): Observable<Utente> {
    return this.http
      .post<Utente>('/api/auth/login', dati)
      .pipe(tap((utente) => this.salvaUtente(utente)));
  }

  registrazione(dati: RegistrazioneRequest): Observable<Utente> {
    return this.http
      .post<Utente>('/api/auth/registrazione', dati)
      .pipe(tap((utente) => this.salvaUtente(utente)));
  }

  logout(): Observable<void> {
    return this.http.post<void>('/api/auth/logout', {}).pipe(finalize(() => this.salvaUtente(null)));
  }

  aggiorna(utente: Utente): void {
    this.salvaUtente(utente);
  }

  esci(): void {
    this.salvaUtente(null);
  }

  verifica(): Observable<boolean> {
    return this.http.get<Utente>('/api/auth/me').pipe(
      map((utente) => {
        this.salvaUtente(utente);
        return true;
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) this.salvaUtente(null);
        return of(this.loggato());
      })
    );
  }

  private salvaUtente(utente: Utente | null): void {
    this.utenteCorrente.set(utente);
    try {
      if (utente) localStorage.setItem(STORAGE_KEY, JSON.stringify(utente));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  private leggiUtente(): Utente | null {
    try {
      const salvato = localStorage.getItem(STORAGE_KEY);
      return salvato ? (JSON.parse(salvato) as Utente) : null;
    } catch {
      return null;
    }
  }
}
