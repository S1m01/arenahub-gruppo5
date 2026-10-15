import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { http, rispondiErrore } from '../testing/admin-test-utils';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  function prepara() {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    const auth = TestBed.inject(AuthService);
    auth.aggiorna({ id: 1, nome: 'Mario', cognome: 'Rossi', ruolo: 'utente' });
    const router = TestBed.inject(Router);
    const naviga = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    return { auth, naviga, client: TestBed.inject(HttpClient) };
  }

  it('con sessione scaduta toglie l utente e porta al login', () => {
    const { auth, naviga, client } = prepara();
    client.get('/api/utenti/me/statistiche').subscribe({ error: () => {} });
    rispondiErrore(http().expectOne('/api/utenti/me/statistiche'), 401, 'Utente non autenticato');
    expect(auth.loggato()).toBe(false);
    expect(naviga).toHaveBeenCalledWith('/login');
  });

  it('ignora il 401 del login sbagliato', () => {
    const { auth, naviga, client } = prepara();
    client.post('/api/auth/login', {}).subscribe({ error: () => {} });
    rispondiErrore(http().expectOne('/api/auth/login'), 401, 'Email o password errate');
    expect(auth.loggato()).toBe(true);
    expect(naviga).not.toHaveBeenCalled();
  });
});
