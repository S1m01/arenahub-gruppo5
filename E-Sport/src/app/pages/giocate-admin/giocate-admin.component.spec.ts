import { TestBed } from '@angular/core/testing';
import { http, providerAdmin, rispondiErrore, scrivi, testo, torneoApi } from '../../testing/admin-test-utils';
import { GiocateAdminComponent } from './giocate-admin.component';

describe('GiocateAdminComponent', () => {
  const giocate = [
    {
      id: 91,
      torneoId: 4,
      torneo: "Lega R6 d'autunno",
      titolo: 'Clutch 1 contro 3',
      youtubeId: 'dQw4w9WgXcQ',
      inizioSec: 90,
      fineSec: 135,
      partitaId: 9,
      turno: 'Giornata 1',
      utenteId: 3,
      giocatore: 'Mario Rossi',
    },
  ];

  async function crea() {
    TestBed.configureTestingModule({ imports: [GiocateAdminComponent], providers: providerAdmin(4) });
    const fixture = TestBed.createComponent(GiocateAdminComponent);
    fixture.detectChanges();
    http().expectOne('/api/tornei/4').flush(torneoApi());
    http().expectOne((r) => r.url === '/api/giocate' && r.params.get('torneoId') === '4').flush(giocate);
    http()
      .expectOne('/api/tornei/4/partite')
      .flush([{ id: 9, torneoId: 4, turno: 'Giornata 1', dataOra: null, stato: 'conclusa', squadre: [] }]);
    http()
      .expectOne('/api/tornei/4/squadre')
      .flush([{ id: 12, nome: 'Vipers', capitanoId: 3, componenti: [{ utenteId: 3, nome: 'Mario', cognome: 'Rossi' }] }]);
    fixture.detectChanges();
    await fixture.whenStable();
    return { f: fixture, el: fixture.nativeElement as HTMLElement };
  }

  function compila(el: HTMLElement, link: string, inizio: string, fine: string) {
    scrivi(el, 'input[name=link]', link);
    scrivi(el, 'input[name=titolo]', 'Gol al volo');
    scrivi(el, 'input[name=inizio]', inizio);
    scrivi(el, 'input[name=fine]', fine);
  }

  function invia(el: HTMLElement) {
    (el.querySelector('form button[type=submit]') as HTMLButtonElement).click();
  }

  afterEach(() => {
    vi.restoreAllMocks();
    http().verify();
  });

  it('elenca le giocate con tempi, partita e giocatore', async () => {
    const { el } = await crea();
    const celle = [...el.querySelectorAll('tbody td')].map((c) => c.textContent!.trim());
    expect(celle.slice(0, 4)).toEqual(['Clutch 1 contro 3', '1:30 - 2:15', 'Giornata 1', 'Mario Rossi']);
    expect(el.querySelector('tbody a')!.getAttribute('href')).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=90s');
  });

  it.each([
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10', 'dQw4w9WgXcQ'],
    ['https://youtu.be/dQw4w9WgXcQ?si=abc', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
  ])('ricava l’ID dal link %s', async (link, id) => {
    const { f, el } = await crea();
    scrivi(el, 'input[name=link]', link);
    f.detectChanges();
    expect(testo(el)).toContain(`ID del video: ${id}`);
  });

  it('segnala un link non valido e tempi sbagliati senza inviare', async () => {
    const { f, el } = await crea();
    compila(el, 'https://vimeo.com/123', '1:30', '2:15');
    f.detectChanges();
    expect(testo(el)).toContain('Link non riconosciuto');
    invia(el);
    f.detectChanges();
    expect(testo(el)).toContain('Link YouTube non valido');

    compila(el, 'https://youtu.be/dQw4w9WgXcQ', '2:15', '1:30');
    invia(el);
    f.detectChanges();
    expect(testo(el)).toContain("La fine deve essere dopo l'inizio");

    compila(el, 'https://youtu.be/dQw4w9WgXcQ', '1:75', '2:00');
    invia(el);
    f.detectChanges();
    expect(testo(el)).toContain('Tempi non validi');
    http().expectNone('/api/tornei/4/giocate');
  });

  it('aggiunge una giocata con tempi in secondi, partita e giocatore', async () => {
    const { f, el } = await crea();
    compila(el, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '1:30', '2:15');
    scrivi(el, 'select[name=partita]', '9');
    scrivi(el, 'select[name=giocatore]', '3');
    f.detectChanges();
    invia(el);

    const req = http().expectOne('/api/tornei/4/giocate');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      titolo: 'Gol al volo',
      youtubeId: 'dQw4w9WgXcQ',
      inizioSec: 90,
      fineSec: 135,
      partitaId: 9,
      utenteId: 3,
    });
    req.flush({});
    http().expectOne((r) => r.url === '/api/giocate').flush(giocate);
    f.detectChanges();
    expect(testo(el)).toContain('Giocata aggiunta');
    expect((el.querySelector('input[name=titolo]') as HTMLInputElement).value).toBe('');
  });

  it("senza partita e giocatore li manda come null; mostra l'errore del backend", async () => {
    const { f, el } = await crea();
    compila(el, 'dQw4w9WgXcQ', '0:05', '0:20');
    invia(el);
    const req = http().expectOne('/api/tornei/4/giocate');
    expect(req.request.body.partitaId).toBeNull();
    expect(req.request.body.utenteId).toBeNull();
    rispondiErrore(req, 422, 'La partita 40 non appartiene a questo torneo');
    f.detectChanges();
    expect(testo(el)).toContain('La partita 40 non appartiene a questo torneo');
  });

  it('elimina una giocata dopo la conferma', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const { f, el } = await crea();
    (el.querySelector('.pericolo') as HTMLButtonElement).click();
    const req = http().expectOne('/api/giocate/91');
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
    f.detectChanges();
    expect(testo(el)).toContain('Nessuna giocata per questo torneo');
  });
});
