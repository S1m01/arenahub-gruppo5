import { TestBed } from '@angular/core/testing';
import {
  http,
  providerAdmin,
  rispondiErrore,
  scrivi,
  testo,
  torneoApi,
} from '../../testing/admin-test-utils';
import { PartiteComponent } from './partite.component';

describe('PartiteComponent', () => {
  const partite = [
    {
      id: 9,
      torneoId: 4,
      turno: 'Giornata 1',
      dataOra: '2026-10-10T21:00:00',
      stato: 'conclusa',
      squadre: [
        { squadraId: 12, nome: 'Vipers', punti: 7 },
        { squadraId: 13, nome: 'Black Ice', punti: 5 },
      ],
    },
    {
      id: 11,
      torneoId: 4,
      turno: 'Giornata 3',
      dataOra: '2026-10-16T21:00:00',
      stato: 'programmata',
      squadre: [
        { squadraId: 12, nome: 'Vipers', punti: null },
        { squadraId: 14, nome: 'Breach Team', punti: null },
      ],
    },
  ];
  const squadre = [
    { id: 12, nome: 'Vipers', capitanoId: 3, componenti: [] },
    { id: 13, nome: 'Black Ice', capitanoId: 8, componenti: [] },
    { id: 14, nome: 'Breach Team', capitanoId: 18, componenti: [] },
  ];

  async function crea(stato: 'aperto' | 'chiuso' | 'concluso' = 'chiuso') {
    TestBed.configureTestingModule({ imports: [PartiteComponent], providers: providerAdmin(4) });
    const fixture = TestBed.createComponent(PartiteComponent);
    fixture.detectChanges();
    http().expectOne('/api/tornei/4').flush(torneoApi({ stato }));
    http().expectOne('/api/tornei/4/partite').flush(partite);
    http().expectOne('/api/tornei/4/squadre').flush(squadre);
    fixture.detectChanges();
    await fixture.whenStable();
    return { f: fixture, el: fixture.nativeElement as HTMLElement };
  }

  afterEach(() => http().verify());

  it('elenca le partite con i punti e i link ai punti', async () => {
    const { el } = await crea();
    const t = testo(el);
    expect(t).toContain('Vipers 7 - Black Ice 5');
    expect(t).toContain('Vipers - Breach Team');
    const link = [...el.querySelectorAll('a.btn-piccolo')].map((a) => [a.textContent!.trim(), a.getAttribute('href')]);
    expect(link).toEqual([
      ['Modifica punti', '/admin/partite/9/punti'],
      ['Inserisci punti', '/admin/partite/11/punti'],
    ]);
  });

  it('crea una partita con almeno 2 squadre', async () => {
    const { f, el } = await crea();
    const crea_ = el.querySelector('button.crea') as HTMLButtonElement;
    const caselle = [...el.querySelectorAll('.casella input')] as HTMLInputElement[];
    caselle[0].click();
    f.detectChanges();
    expect(crea_.disabled).toBe(true);
    caselle[2].click();
    scrivi(el, 'input[name=turno]', ' Finale ');
    scrivi(el, 'input[name=dataOra]', '2026-10-18T18:00');
    f.detectChanges();
    expect(crea_.disabled).toBe(false);
    crea_.click();

    const req = http().expectOne('/api/tornei/4/partite');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ turno: 'Finale', dataOra: '2026-10-18T18:00:00', squadre: [12, 14] });
    req.flush({});
    http().expectOne('/api/tornei/4/partite').flush(partite);
    f.detectChanges();
    expect(testo(el)).toContain('Partita creata');
    expect(caselle.every((c) => !c.checked)).toBe(true);
  });

  it("mostra l'errore del backend", async () => {
    const { f, el } = await crea();
    const caselle = [...el.querySelectorAll('.casella input')] as HTMLInputElement[];
    caselle[0].click();
    caselle[1].click();
    f.detectChanges();
    (el.querySelector('button.crea') as HTMLButtonElement).click();
    rispondiErrore(http().expectOne('/api/tornei/4/partite'), 422, 'Le partite si creano a torneo chiuso');
    f.detectChanges();
    expect(testo(el)).toContain('Le partite si creano a torneo chiuso');
  });

  it('con torneo aperto non mostra il form', async () => {
    const { el } = await crea('aperto');
    expect(el.querySelector('form')).toBeNull();
    expect(testo(el)).toContain('dopo aver chiuso le iscrizioni');
  });

  it('con torneo concluso non mostra form né pulsanti dei punti', async () => {
    const { el } = await crea('concluso');
    expect(el.querySelector('form')).toBeNull();
    expect(el.querySelectorAll('a.btn-piccolo').length).toBe(0);
  });
});
