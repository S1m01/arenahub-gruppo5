import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { providerAdmin } from '../testing/admin-test-utils';
import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
  function esegui(ruolo: 'admin' | 'utente' | null) {
    TestBed.configureTestingModule({ providers: providerAdmin() });
    localStorage.clear();
    const auth = TestBed.inject(AuthService) as unknown as {
      utenteCorrente: { set(v: unknown): void };
    };
    auth.utenteCorrente.set(ruolo ? { id: 1, nome: 'Test', cognome: 'T', ruolo } : null);
    const esito = TestBed.runInInjectionContext(() =>
      adminGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    const router = TestBed.inject(Router);
    return esito instanceof UrlTree ? router.serializeUrl(esito) : esito;
  }

  it("lascia passare l'admin", () => {
    expect(esegui('admin')).toBe(true);
  });

  it("manda alla home l'utente normale", () => {
    expect(esegui('utente')).toBe('/');
  });

  it('manda al login chi non è loggato', () => {
    expect(esegui(null)).toBe('/login');
  });
});
