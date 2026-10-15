import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { http, providerAdmin, rispondiErrore } from '../testing/admin-test-utils';
import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
  function esegui(ruolo: 'admin' | 'utente' | null) {
    TestBed.configureTestingModule({ providers: providerAdmin() });
    let esito: boolean | UrlTree | undefined;
    TestBed.runInInjectionContext(() =>
      (adminGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot) as Observable<boolean | UrlTree>)
        .subscribe((r) => (esito = r))
    );
    const req = http().expectOne('/api/auth/me');
    if (ruolo) req.flush({ id: 1, nome: 'Test', cognome: 'T', ruolo });
    else rispondiErrore(req, 401, 'Utente non autenticato');
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
