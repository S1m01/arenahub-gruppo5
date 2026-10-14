import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { CardGiocataComponent } from '../../components/card-giocata/card-giocata.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  Giocata,
  Partita,
  PosizioneGiocatore,
  PosizioneSquadra,
  Squadra,
  Statistiche,
  TorneoDettaglio,
} from '../../models/torneo.model';
import { messaggioErrore } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { GiocateService } from '../../services/giocate.service';
import { TorneiService } from '../../services/tornei.service';
import { UtenteService } from '../../services/utente.service';

type Scheda = 'PARTITE' | 'CLASSIFICA_SQUADRE' | 'CLASSIFICA_GIOCATORI' | 'TOP_GIOCATE';

type Azione =
  | { tipo: 'ACCEDI' }
  | { tipo: 'ISCRIVITI' }
  | { tipo: 'CREA_SQUADRA' }
  | { tipo: 'ISCRITTO'; squadra: string; puoAnnullare: boolean }
  | { tipo: 'MESSAGGIO'; testo: string };

@Component({
  selector: 'app-torneo',
  imports: [CardGiocataComponent, DatePipe, NgTemplateOutlet, RouterLink],
  templateUrl: './torneo.component.html',
  styleUrl: './torneo.component.css',
})
export class TorneoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private torneiService = inject(TorneiService);
  private giocateService = inject(GiocateService);
  private utenteService = inject(UtenteService);
  auth = inject(AuthService);

  statistiche = signal<Statistiche | null>(null);

  torneo = signal<TorneoDettaglio | null>(null);
  squadre = signal<Squadra[]>([]);
  partite = signal<Partita[]>([]);
  classifica = signal<PosizioneSquadra[]>([]);
  classificaGiocatori = signal<PosizioneGiocatore[]>([]);
  giocate = signal<Giocata[]>([]);

  caricamento = signal(true);
  errore = signal<string | null>(null);
  scheda = signal<Scheda>('PARTITE');

  invioIscrizione = signal(false);
  esitoIscrizione = signal<{ ok: boolean; testo: string } | null>(null);

  readonly schede: { id: Scheda; label: string }[] = [
    { id: 'PARTITE', label: 'Partite' },
    { id: 'CLASSIFICA_SQUADRE', label: 'Classifica squadre' },
    { id: 'CLASSIFICA_GIOCATORI', label: 'Classifica giocatori' },
    { id: 'TOP_GIOCATE', label: 'Top giocate' },
  ];

  conRisultati = computed(() => {
    const t = this.torneo();
    return !!t && (t.stato === 'CONCLUSO' || t.inCorso);
  });

  indietro = computed(() =>
    this.torneo()?.stato === 'CONCLUSO'
      ? { link: '/tornei-chiusi', label: 'Tornei chiusi' }
      : { link: '/', label: 'Tutti i tornei' }
  );

  postiLiberi = computed(() => {
    const t = this.torneo();
    return t ? Math.max(t.postiMassimi - t.iscritti, 0) : 0;
  });

  azione = computed<Azione | null>(() => {
    const t = this.torneo();
    if (!t || t.stato === 'CONCLUSO') return null;
    if (t.miaSquadra) {
      const puoAnnullare = t.stato === 'APERTO' && t.miaSquadra.sonoCapitano;
      return { tipo: 'ISCRITTO', squadra: t.miaSquadra.nome, puoAnnullare };
    }
    if (t.stato === 'CHIUSO') return { tipo: 'MESSAGGIO', testo: 'Le iscrizioni sono chiuse' };
    if (this.postiLiberi() === 0) return { tipo: 'MESSAGGIO', testo: 'Il torneo è completo' };
    if (!this.auth.loggato()) return { tipo: 'ACCEDI' };
    const s = this.statistiche();
    if (s && s.torniAttivi >= s.maxTorneiAttivi) {
      return { tipo: 'MESSAGGIO', testo: `Hai raggiunto il limite di ${s.maxTorneiAttivi} tornei attivi` };
    }
    return t.modalita === 'SINGOLO' ? { tipo: 'ISCRIVITI' } : { tipo: 'CREA_SQUADRA' };
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      this.errore.set('Torneo non trovato.');
      this.caricamento.set(false);
      return;
    }

    this.torneiService.getTorneo(id).subscribe({
      next: (t) => {
        this.torneo.set(t);
        this.caricamento.set(false);
        this.caricaDettagli(t);
      },
      error: (err: HttpErrorResponse) => {
        this.errore.set(
          err.status === 404 ? 'Torneo non trovato.' : 'Impossibile caricare il torneo. Riprova più tardi.'
        );
        this.caricamento.set(false);
      },
    });
    this.caricaStatistiche();
  }

  iscriviti(): void {
    const t = this.torneo();
    if (!t) return;

    this.invioIscrizione.set(true);
    this.esitoIscrizione.set(null);

    this.torneiService.iscriviti(t.id).subscribe({
      next: () => {
        this.invioIscrizione.set(false);
        this.esitoIscrizione.set({ ok: true, testo: 'Iscrizione completata!' });
        this.ricarica(t.id);
      },
      error: (err: HttpErrorResponse) => {
        this.invioIscrizione.set(false);
        this.esitoIscrizione.set({ ok: false, testo: messaggioErrore(err, 'Iscrizione non riuscita') });
      },
    });
  }

  annullaIscrizione(): void {
    const t = this.torneo();
    if (!t || !confirm(`Vuoi annullare l'iscrizione a "${t.nome}"?`)) return;

    this.invioIscrizione.set(true);
    this.esitoIscrizione.set(null);

    this.utenteService.annullaIscrizione(t.id).subscribe({
      next: () => {
        this.invioIscrizione.set(false);
        this.esitoIscrizione.set({ ok: true, testo: 'Iscrizione annullata' });
        this.ricarica(t.id);
      },
      error: (err: HttpErrorResponse) => {
        this.invioIscrizione.set(false);
        this.esitoIscrizione.set({ ok: false, testo: messaggioErrore(err, 'Annullamento non riuscito') });
      },
    });
  }

  private ricarica(id: number): void {
    this.torneiService.getTorneo(id).subscribe((t) => this.torneo.set(t));
    this.torneiService.getSquadre(id).subscribe((s) => this.squadre.set(s));
    this.caricaStatistiche();
  }

  private caricaStatistiche(): void {
    if (!this.auth.loggato()) return;
    this.utenteService.getStatistiche().subscribe({
      next: (s) => this.statistiche.set(s),
      error: () => this.statistiche.set(null),
    });
  }

  etichettaModalita(t: TorneoDettaglio): string {
    switch (t.modalita) {
      case 'SINGOLO':
        return 'Singolo';
      case 'DUO':
        return 'Duo';
      default:
        return `Squadra (${t.giocatoriPerSquadra})`;
    }
  }

  descrizioneModalita(t: TorneoDettaglio): string {
    switch (t.modalita) {
      case 'SINGOLO':
        return 'singolo, 1 contro 1';
      case 'DUO':
        return 'duo, coppie da 2 giocatori';
      default:
        return `squadra da ${t.giocatoriPerSquadra} giocatori`;
    }
  }

  etichettaStato(t: TorneoDettaglio): string {
    if (t.stato === 'CONCLUSO') return 'Concluso';
    if (t.inCorso) return 'In corso';
    return t.stato === 'APERTO' ? 'Aperto' : 'Chiuso';
  }

  classeStato(t: TorneoDettaglio): string {
    if (t.stato === 'CONCLUSO') return 'badge concluso';
    if (t.inCorso) return 'badge in-corso';
    return t.stato === 'APERTO' ? 'badge aperto' : 'badge chiuso';
  }

  sfondo(t: TorneoDettaglio): string | null {
    return t.foto ? `url('${t.foto}')` : null;
  }

  sfidanti(p: Partita): string {
    return p.squadre.map((s) => s.nome).join(' - ');
  }

  esito(p: Partita): string {
    if (p.stato !== 'CONCLUSA') return 'da giocare';
    return p.squadre.map((s) => s.punti ?? 0).join(' - ');
  }

  nomiComponenti(s: Squadra): string {
    return s.componenti.map((c) => c.nome).join(', ');
  }

  private caricaDettagli(t: TorneoDettaglio): void {
    this.torneiService.getSquadre(t.id).subscribe({
      next: (s) => this.squadre.set(s),
      error: () => this.squadre.set([]),
    });

    if (!this.conRisultati()) return;

    this.torneiService.getPartite(t.id).subscribe({
      next: (p) => this.partite.set(p),
      error: () => this.partite.set([]),
    });
    this.torneiService.getClassifica(t.id).subscribe({
      next: (c) => this.classifica.set(c),
      error: () => this.classifica.set([]),
    });
    this.torneiService.getClassificaGiocatori(t.id).subscribe({
      next: (c) => this.classificaGiocatori.set(c),
      error: () => this.classificaGiocatori.set([]),
    });
    this.giocateService.getGiocate(t.id).subscribe({
      next: (g) => this.giocate.set(g),
      error: () => this.giocate.set([]),
    });
  }
}
