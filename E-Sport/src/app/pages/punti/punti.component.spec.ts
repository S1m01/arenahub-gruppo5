import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PartitaDettaglioApi } from '../../models/api.model';
import { http, providerAdmin, rispondiErrore, scrivi, testo } from '../../testing/admin-test-utils';
import { PuntiComponent } from './punti.component';

describe('PuntiComponent', () => {
  function partita(stato: 'programmata' | 'conclusa' = 'programmata'): PartitaDettaglioApi {
    const conclusa = stato === 'conclusa';
    return {
      id: 11,
      torneoId: 4,
      torneo: "Lega R6 d'autunno",
      turno: 'Giornata 3',
      dataOra: '2026-10-16T21:00:00',
      stato,
      squadre: [
        {
          squadraId: 12,
          nome: 'Vipers',
          punti: conclusa ? 4 : null,
          giocatori: [
            { utenteId: 3, nome: 'Mario', cognome: 'Rossi', punti: conclusa ? 3 : null },
            { utenteId: 5, nome: 'Sara', cognome: 'Neri', punti: conclusa ? 1 : null },
          ],
        },
        {
          squadraId: 14,
          nome: 'Breach Team',
          punti: conclusa ? 2 : null,
          giocatori: [{ utenteId: 18, nome: 'Andrea', cognome: 'Ferrari', punti: null }],
        },
      ],
    };
  }

  async function crea(stato: 'programmata' | 'conclusa' = 'programmata') {
    TestBed.configureTestingModule({ imports: [PuntiComponent], providers: providerAdmin(11) });
    const fixture = TestBed.createComponent(PuntiComponent);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
    http().expectOne('/api/partite/11').flush(partita(stato));
    fixture.detectChanges();
    await fixture.whenStable();
    return { f: fixture, el: fixture.nativeElement as HTMLElement, navigate };
  }

  function clic(el: HTMLElement, etichetta: string) {
    [...el.querySelectorAll('button')].find((b) => b.textContent!.trim() === etichetta)!.click();
  }

  afterEach(() => {
    vi.restoreAllMocks();
    http().verify();
  });

  it('mostra titolo, squadre e giocatori', async () => {
    const { el } = await crea();
    const t = testo(el);
    expect(t).toContain("Giornata 3 - 16/10 21:00 - Lega R6 d'autunno");
    expect(t).toContain('Vipers');
    expect(t).toContain('Mario Rossi');
    expect(t).toContain('Andrea Ferrari');
  });

  it('controlla i dati prima di inviare', async () => {
    const { f, el } = await crea();
    const esito = () => el.querySelector('.esito')?.textContent?.trim();

    clic(el, 'Salva punti');
    f.detectChanges();
    expect(esito()).toBe('Indicare i punti di tutte le squadre della partita');

    scrivi(el, 'input[name=squadra-12]', '3');
    scrivi(el, 'input[name=squadra-14]', '-1');
    clic(el, 'Salva punti');
    f.detectChanges();
    expect(esito()).toContain('numeri interi non negativi');

    scrivi(el, 'input[name=squadra-14]', '2');
    scrivi(el, 'input[name=giocatore-12-3]', '2');
    clic(el, 'Salva punti');
    f.detectChanges();
    expect(esito()).toBe('Vipers: indicare i punti di tutti i componenti della squadra o di nessuno');
    http().expectNone('/api/partite/11/punti');
  });

  it('salva senza concludere e manda i giocatori solo se completi', async () => {
    const { f, el } = await crea();
    scrivi(el, 'input[name=squadra-12]', '3');
    scrivi(el, 'input[name=squadra-14]', '1');
    scrivi(el, 'input[name=giocatore-12-3]', '2');
    scrivi(el, 'input[name=giocatore-12-5]', '1');
    clic(el, 'Salva punti');

    const req = http().expectOne('/api/partite/11/punti');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({
      concludi: false,
      squadre: [
        {
          squadraId: 12,
          punti: 3,
          giocatori: [
            { utenteId: 3, punti: 2 },
            { utenteId: 5, punti: 1 },
          ],
        },
        { squadraId: 14, punti: 1 },
      ],
    });
    req.flush(partita());
    f.detectChanges();
    expect(testo(el)).toContain('Punti salvati');
  });

  it('salva e conclude dopo la conferma, poi torna alle partite', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const { el, navigate } = await crea();
    scrivi(el, 'input[name=squadra-12]', '3');
    scrivi(el, 'input[name=squadra-14]', '1');
    clic(el, 'Salva e concludi partita');

    const req = http().expectOne('/api/partite/11/punti');
    expect(req.request.body.concludi).toBe(true);
    req.flush(partita('conclusa'));
    expect(navigate).toHaveBeenCalledWith(['/admin/tornei', 4, 'partite']);
  });

  it('se la conferma viene annullata non invia nulla', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const { el } = await crea();
    scrivi(el, 'input[name=squadra-12]', '3');
    scrivi(el, 'input[name=squadra-14]', '1');
    clic(el, 'Salva e concludi partita');
    http().expectNone('/api/partite/11/punti');
  });

  it('una partita conclusa si corregge restando conclusa', async () => {
    const { el } = await crea('conclusa');
    expect((el.querySelector('input[name=squadra-12]') as HTMLInputElement).value).toBe('4');
    expect([...el.querySelectorAll('button')].map((b) => b.textContent!.trim())).toEqual(['Salva correzione']);
    scrivi(el, 'input[name=giocatore-12-3]', '');
    scrivi(el, 'input[name=giocatore-12-5]', '');
    clic(el, 'Salva correzione');
    const req = http().expectOne('/api/partite/11/punti');
    expect(req.request.body.concludi).toBe(true);
    expect(req.request.body.squadre[0]).toEqual({ squadraId: 12, punti: 4 });
    req.flush(partita('conclusa'));
  });

  it("mostra l'errore del backend", async () => {
    const { f, el } = await crea();
    scrivi(el, 'input[name=squadra-12]', '3');
    scrivi(el, 'input[name=squadra-14]', '1');
    clic(el, 'Salva punti');
    rispondiErrore(
      http().expectOne('/api/partite/11/punti'),
      422,
      'Il torneo è concluso: i punti non sono più modificabili'
    );
    f.detectChanges();
    expect(testo(el)).toContain('i punti non sono più modificabili');
  });
});
