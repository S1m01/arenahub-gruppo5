import { TestBed } from '@angular/core/testing';
import { GiocataApi } from '../../models/api.model';
import { http, providerAdmin, testo } from '../../testing/admin-test-utils';
import { TopGiocateComponent } from './top-giocate.component';

describe('TopGiocateComponent', () => {
  // Formato del contratto (GET /api/giocate).
  const giocate: GiocataApi[] = [
    {
      id: 8,
      torneoId: 11,
      torneo: 'Mortal Kombat Summer Fight',
      titolo: 'The best comeback',
      youtubeId: 'pXxwFCwoUH0',
      inizioSec: 0,
      fineSec: 54,
      partitaId: 30,
      turno: 'Finale',
      utenteId: 7,
      giocatore: 'Marco Riva',
    },
    {
      id: 9,
      torneoId: 4,
      torneo: "Lega R6 d'autunno",
      titolo: 'Clutch',
      youtubeId: 'dQw4w9WgXcQ',
      inizioSec: 90,
      fineSec: 135,
      partitaId: null,
      turno: null,
      utenteId: null,
      giocatore: null,
    },
  ];

  async function crea() {
    TestBed.configureTestingModule({ imports: [TopGiocateComponent], providers: providerAdmin() });
    const fixture = TestBed.createComponent(TopGiocateComponent);
    fixture.detectChanges();
    http().expectOne((r) => r.url === '/api/giocate' && !r.params.has('categoria')).flush(giocate);
    http().expectOne('/api/categorie').flush(['Picchiaduro', 'Sparatutto']);
    fixture.detectChanges();
    await fixture.whenStable();
    return { f: fixture, el: fixture.nativeElement as HTMLElement };
  }

  afterEach(() => http().verify());

  it('mostra il video incorporato e i dettagli di ogni clip', async () => {
    const { el } = await crea();
    const iframe = el.querySelectorAll('iframe');
    expect(iframe.length).toBe(2);
    expect(iframe[0].getAttribute('src')).toContain('/embed/pXxwFCwoUH0');
    expect(iframe[1].getAttribute('src')).toContain('start=90');
    expect(iframe[1].getAttribute('src')).toContain('end=135');
    expect(testo(el)).toContain('Mortal Kombat Summer Fight · Finale · Marco Riva');
    expect(testo(el)).not.toContain('Video non disponibile');
  });

  it('il filtro categoria chiede le giocate al backend', async () => {
    const { f, el } = await crea();
    const selects = el.querySelectorAll('select');
    (selects[1] as HTMLSelectElement).value = 'Picchiaduro';
    selects[1].dispatchEvent(new Event('change'));
    const req = http().expectOne((r) => r.url === '/api/giocate' && r.params.get('categoria') === 'Picchiaduro');
    req.flush([giocate[0]]);
    f.detectChanges();
    expect(el.querySelectorAll('app-card-giocata').length).toBe(1);
  });

  it('il filtro torneo lavora sulle clip già caricate', async () => {
    const { f, el } = await crea();
    const torneo = el.querySelectorAll('select')[0] as HTMLSelectElement;
    torneo.value = '4';
    torneo.dispatchEvent(new Event('change'));
    f.detectChanges();
    expect(testo(el)).toContain('Clutch');
    expect(el.querySelectorAll('app-card-giocata').length).toBe(1);
  });
});
