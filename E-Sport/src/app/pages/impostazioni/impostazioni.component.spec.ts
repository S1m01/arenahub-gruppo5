import { TestBed } from '@angular/core/testing';
import { http, providerAdmin, rispondiErrore, scrivi, testo } from '../../testing/admin-test-utils';
import { ImpostazioniComponent } from './impostazioni.component';

describe('ImpostazioniComponent', () => {
  async function crea() {
    TestBed.configureTestingModule({ imports: [ImpostazioniComponent], providers: providerAdmin() });
    const fixture = TestBed.createComponent(ImpostazioniComponent);
    fixture.detectChanges();
    http().expectOne('/api/impostazioni').flush({ maxTorneiAttivi: 3 });
    fixture.detectChanges();
    await fixture.whenStable();
    return { f: fixture, el: fixture.nativeElement as HTMLElement };
  }

  function invia(el: HTMLElement) {
    (el.querySelector('button[type=submit]') as HTMLButtonElement).click();
  }

  afterEach(() => http().verify());

  it('mostra il limite attuale', async () => {
    const { el } = await crea();
    expect((el.querySelector('input') as HTMLInputElement).value).toBe('3');
  });

  it.each(['0', '4', '2.5', ''])('rifiuta il valore "%s"', async (valore) => {
    const { f, el } = await crea();
    scrivi(el, 'input', valore);
    invia(el);
    f.detectChanges();
    expect(testo(el)).toContain('Il limite deve essere un numero intero da 1 a 3');
    http().expectNone('/api/impostazioni');
  });

  it('salva il nuovo limite', async () => {
    const { f, el } = await crea();
    scrivi(el, 'input', '2');
    invia(el);
    const req = http().expectOne('/api/impostazioni');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ maxTorneiAttivi: 2 });
    req.flush({ maxTorneiAttivi: 2 });
    f.detectChanges();
    expect(testo(el)).toContain('Limite salvato: 2 tornei attivi per utente');
  });

  it("mostra l'errore del backend", async () => {
    const { f, el } = await crea();
    scrivi(el, 'input', '2');
    invia(el);
    rispondiErrore(http().expectOne('/api/impostazioni'), 403, 'Operazione non consentita');
    f.detectChanges();
    expect(testo(el)).toContain('Operazione non consentita');
  });
});
