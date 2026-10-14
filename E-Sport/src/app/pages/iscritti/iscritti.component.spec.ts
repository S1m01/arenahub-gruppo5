import { TestBed } from '@angular/core/testing';
import { http, providerAdmin, rispondiErrore, testo, torneoApi } from '../../testing/admin-test-utils';
import { IscrittiComponent } from './iscritti.component';

describe('IscrittiComponent', () => {
  async function crea() {
    TestBed.configureTestingModule({ imports: [IscrittiComponent], providers: providerAdmin(4) });
    const fixture = TestBed.createComponent(IscrittiComponent);
    fixture.detectChanges();
    return fixture;
  }

  afterEach(() => http().verify());

  it('mostra squadre, capitano, componenti e data', async () => {
    const f = await crea();
    http().expectOne('/api/tornei/4').flush(torneoApi({ stato: 'chiuso', iscritti: 2 }));
    http()
      .expectOne('/api/tornei/4/iscritti')
      .flush([
        {
          squadraId: 13,
          squadra: 'Black Ice',
          capitanoId: 16,
          data: '2026-10-01T10:00:00',
          componenti: [
            { utenteId: 8, nome: 'Giulia', cognome: 'Bianchi', email: 'g@mail.it' },
            { utenteId: 16, nome: 'Lorenzo', cognome: 'Bruno', email: 'l@mail.it' },
          ],
        },
      ]);
    f.detectChanges();
    const t = testo(f.nativeElement);
    expect(t).toContain("Lega R6 d'autunno - Iscritti");
    expect(t).toContain('Chiuso · 2 squadre su 4 posti');
    const celle = [...(f.nativeElement as HTMLElement).querySelectorAll('tbody td')].map((c) =>
      c.textContent!.replace(/\s+/g, ' ').trim()
    );
    expect(celle).toEqual(['Black Ice', 'Lorenzo Bruno', 'Giulia Bianchi, Lorenzo Bruno', '01/10 10:00']);
  });

  it("nei tornei singoli mostra giocatore ed email", async () => {
    const f = await crea();
    http().expectOne('/api/tornei/4').flush(torneoApi({ modalita: 'singolo', giocatoriPerSquadra: 1 }));
    http()
      .expectOne('/api/tornei/4/iscritti')
      .flush([
        {
          squadraId: 1,
          squadra: 'Mario Rossi',
          capitanoId: 3,
          data: '2026-10-01T10:00:00',
          componenti: [{ utenteId: 3, nome: 'Mario', cognome: 'Rossi', email: 'mario@mail.it' }],
        },
      ]);
    f.detectChanges();
    const intestazioni = [...(f.nativeElement as HTMLElement).querySelectorAll('th')].map((th) =>
      th.textContent!.trim()
    );
    expect(intestazioni).toEqual(['Giocatore', 'Email', 'Iscritta il']);
    expect(testo(f.nativeElement)).toContain('mario@mail.it');
  });

  it('senza permessi mostra il messaggio', async () => {
    const f = await crea();
    http().expectOne('/api/tornei/4').flush(torneoApi());
    rispondiErrore(http().expectOne('/api/tornei/4/iscritti'), 403, 'Operazione non consentita');
    f.detectChanges();
    expect(testo(f.nativeElement)).toContain('Operazione non consentita');
  });
});
