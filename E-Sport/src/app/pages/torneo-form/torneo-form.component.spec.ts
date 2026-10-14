import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  http,
  providerAdmin,
  rispondiErrore,
  scrivi,
  testo,
  torneoApi,
} from '../../testing/admin-test-utils';
import { TorneoFormComponent } from './torneo-form.component';

describe('TorneoFormComponent', () => {
  const categorie = ['Calcio', 'Sparatutto'];

  async function crea(id?: number) {
    TestBed.configureTestingModule({ imports: [TorneoFormComponent], providers: providerAdmin(id) });
    const fixture = TestBed.createComponent(TorneoFormComponent);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
    http().expectOne('/api/categorie').flush(categorie);
    fixture.detectChanges();
    await fixture.whenStable();
    return { f: fixture, el: fixture.nativeElement as HTMLElement, navigate };
  }

  function invia(el: HTMLElement) {
    (el.querySelector('button[type=submit]') as HTMLButtonElement).click();
  }

  afterEach(() => {
    vi.restoreAllMocks();
    http().verify();
  });

  it('crea un torneo a squadre con i dati del form', async () => {
    const { f, el, navigate } = await crea();
    scrivi(el, '[formcontrolname=nome]', '  Coppa Primavera ');
    scrivi(el, '[formcontrolname=gioco]', 'Calcio virtuale');
    scrivi(el, '[formcontrolname=categoria]', 'Calcio');
    scrivi(el, '[formcontrolname=modalita]', 'squadra');
    f.detectChanges();
    scrivi(el, '[formcontrolname=dataOra]', '2026-11-07T15:00');
    scrivi(el, '[formcontrolname=dataFine]', '2026-11-08T19:00');
    scrivi(el, '[formcontrolname=postiMax]', '16');
    invia(el);

    const req = http().expectOne('/api/tornei');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      nome: 'Coppa Primavera',
      descrizione: null,
      gioco: 'Calcio virtuale',
      categoria: 'Calcio',
      modalita: 'squadra',
      giocatoriPerSquadra: 5,
      dataOra: '2026-11-07T15:00:00',
      dataFine: '2026-11-08T19:00:00',
      postiMax: 16,
      foto: null,
    });
    req.flush(torneoApi({ id: 7 }));
    expect(navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('blocca i giocatori a 1 nel singolo e a 2 nel duo', async () => {
    const { f, el } = await crea();
    const giocatori = el.querySelector('[formcontrolname=giocatoriPerSquadra]') as HTMLInputElement;
    expect(giocatori.value).toBe('1');
    expect(giocatori.disabled).toBe(true);
    scrivi(el, '[formcontrolname=modalita]', 'duo');
    f.detectChanges();
    expect(giocatori.value).toBe('2');
    expect(giocatori.disabled).toBe(true);
  });

  it('non invia se mancano i campi o la fine è prima dell’inizio', async () => {
    const { f, el } = await crea();
    scrivi(el, '[formcontrolname=dataOra]', '2026-11-08T15:00');
    scrivi(el, '[formcontrolname=dataFine]', '2026-11-07T15:00');
    invia(el);
    f.detectChanges();
    const t = testo(el);
    expect(t).toContain('Inserisci il nome');
    expect(t).toContain('Inserisci il gioco');
    expect(t).toContain("La fine non può essere prima dell'inizio");
    http().expectNone('/api/tornei');
  });

  it('una squadra deve avere almeno 3 giocatori', async () => {
    const { f, el } = await crea();
    scrivi(el, '[formcontrolname=modalita]', 'squadra');
    f.detectChanges();
    scrivi(el, '[formcontrolname=giocatoriPerSquadra]', '2');
    invia(el);
    f.detectChanges();
    expect(testo(el)).toContain('Una squadra ha almeno 3 giocatori');
  });

  it('in modifica carica i dati, blocca la modalità con iscritti e manda una PUT', async () => {
    const { f, el, navigate } = await crea(6);
    http()
      .expectOne('/api/tornei/6')
      .flush(torneoApi({ id: 6, nome: 'Clash', modalita: 'singolo', giocatoriPerSquadra: 1, stato: 'aperto', iscritti: 5, postiMax: 16 }));
    f.detectChanges();
    await f.whenStable();

    expect((el.querySelector('[formcontrolname=nome]') as HTMLInputElement).value).toBe('Clash');
    expect((el.querySelector('[formcontrolname=dataOra]') as HTMLInputElement).value).toBe('2026-10-10T21:00');
    expect((el.querySelector('[formcontrolname=modalita]') as HTMLSelectElement).disabled).toBe(true);
    expect(testo(el)).toContain('Non modificabile: ci sono già iscritti');

    scrivi(el, '[formcontrolname=postiMax]', '3');
    invia(el);
    f.detectChanges();
    expect(testo(el)).toContain('Almeno 5 (gli iscritti attuali)');
    http().expectNone('/api/tornei/6');

    scrivi(el, '[formcontrolname=postiMax]', '20');
    invia(el);
    const req = http().expectOne('/api/tornei/6');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.modalita).toBe('singolo');
    expect(req.request.body.postiMax).toBe(20);
    req.flush(torneoApi({ id: 6 }));
    expect(navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('un torneo concluso non è modificabile', async () => {
    const { f, el } = await crea(1);
    http().expectOne('/api/tornei/1').flush(torneoApi({ id: 1, stato: 'concluso' }));
    f.detectChanges();
    expect(testo(el)).toContain('Un torneo concluso non è modificabile');
    expect((el.querySelector('button[type=submit]') as HTMLButtonElement).disabled).toBe(true);
  });

  it("mostra l'errore del backend e resta sulla pagina", async () => {
    const { f, el, navigate } = await crea(6);
    http().expectOne('/api/tornei/6').flush(torneoApi({ id: 6, iscritti: 0, stato: 'aperto' }));
    f.detectChanges();
    invia(el);
    rispondiErrore(http().expectOne('/api/tornei/6'), 422, 'Posti inferiori alle squadre iscritte');
    f.detectChanges();
    expect(testo(el)).toContain('Posti inferiori alle squadre iscritte');
    expect(navigate).not.toHaveBeenCalled();
  });
});
