import { TestBed } from '@angular/core/testing';
import { http, providerAdmin, rispondiErrore, testo, torneoApi } from '../../testing/admin-test-utils';
import { GestioneTorneiComponent } from './gestione-tornei.component';

describe('GestioneTorneiComponent', () => {
  const tornei = [
    torneoApi({ id: 1, nome: 'Concluso', stato: 'concluso' }),
    torneoApi({ id: 2, nome: 'Aperto', stato: 'aperto', modalita: 'singolo', giocatoriPerSquadra: 1 }),
    torneoApi({ id: 3, nome: 'Chiuso', stato: 'chiuso' }),
  ];

  async function crea() {
    TestBed.configureTestingModule({ imports: [GestioneTorneiComponent], providers: providerAdmin() });
    const fixture = TestBed.createComponent(GestioneTorneiComponent);
    fixture.detectChanges();
    http().expectOne('/api/tornei').flush(tornei);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  afterEach(() => {
    vi.restoreAllMocks();
    http().verify();
  });

  it('mostra il riepilogo e ordina aperti, chiusi, conclusi', async () => {
    const f = await crea();
    const el = f.nativeElement as HTMLElement;
    expect(testo(el)).toContain('1 aperto · 1 chiuso · 1 concluso');
    const nomi = [...el.querySelectorAll('tbody tr')].map((r) => r.querySelector('td')!.textContent!.trim());
    expect(nomi).toEqual(['Aperto', 'Chiuso', 'Concluso']);
  });

  it('mostra le azioni giuste per ogni stato', async () => {
    const f = await crea();
    const azioni = [...(f.nativeElement as HTMLElement).querySelectorAll('tbody tr')].map((r) =>
      [...r.querySelectorAll('.azioni-riga > *')].map((b) => b.textContent!.trim())
    );
    expect(azioni[0]).toEqual(['Modifica', 'Iscritti', 'Chiudi']);
    expect(azioni[1]).toEqual(['Partite', 'Giocate', 'Iscritti', 'Concludi']);
    expect(azioni[2]).toEqual(['Partite', 'Giocate', 'Iscritti']);
  });

  it('chiude un torneo dopo la conferma e ricarica la lista', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const f = await crea();
    const chiudi = [...(f.nativeElement as HTMLElement).querySelectorAll('button')].find(
      (b) => b.textContent!.trim() === 'Chiudi'
    )!;
    chiudi.click();

    const req = http().expectOne('/api/tornei/2/stato');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ stato: 'chiuso' });
    req.flush({ id: 2, stato: 'chiuso' });
    http().expectOne('/api/tornei').flush(tornei);
    f.detectChanges();
    expect(testo(f.nativeElement)).toContain('Iscrizioni chiuse: Aperto');
  });

  it('non fa nulla se la conferma viene annullata', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const f = await crea();
    [...(f.nativeElement as HTMLElement).querySelectorAll('button')]
      .find((b) => b.textContent!.trim() === 'Concludi')!
      .click();
    http().expectNone('/api/tornei/3/stato');
  });

  it("mostra l'errore del backend", async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const f = await crea();
    [...(f.nativeElement as HTMLElement).querySelectorAll('button')]
      .find((b) => b.textContent!.trim() === 'Concludi')!
      .click();
    rispondiErrore(http().expectOne('/api/tornei/3/stato'), 422, 'Ci sono partite non concluse');
    f.detectChanges();
    expect(testo(f.nativeElement)).toContain('Chiuso: Ci sono partite non concluse');
  });
});
