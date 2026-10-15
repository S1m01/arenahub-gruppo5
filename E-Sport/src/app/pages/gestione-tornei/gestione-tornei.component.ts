import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Torneo } from '../../models/torneo.model';
import { AdminService, messaggioErrore } from '../../services/admin.service';

const ORDINE_STATO = { APERTO: 0, CHIUSO: 1, CONCLUSO: 2 };

@Component({
  selector: 'app-gestione-tornei',
  imports: [RouterLink],
  templateUrl: './gestione-tornei.component.html',
  styleUrl: './gestione-tornei.component.css',
})
export class GestioneTorneiComponent implements OnInit {
  private admin = inject(AdminService);

  tornei = signal<Torneo[]>([]);
  caricamento = signal(true);
  errore = signal<string | null>(null);
  esito = signal<{ ok: boolean; testo: string } | null>(null);
  inCorsoId = signal<number | null>(null);

  torneiOrdinati = computed(() =>
    [...this.tornei()].sort(
      (a, b) =>
        ORDINE_STATO[a.stato] - ORDINE_STATO[b.stato] ||
        new Date(a.dataInizio).getTime() - new Date(b.dataInizio).getTime()
    )
  );

  riepilogo = computed(() => {
    const conta = (stato: Torneo['stato']) => this.tornei().filter((t) => t.stato === stato).length;
    const aperti = conta('APERTO');
    const chiusi = conta('CHIUSO');
    const conclusi = conta('CONCLUSO');
    return [
      `${aperti} ${aperti === 1 ? 'aperto' : 'aperti'}`,
      `${chiusi} ${chiusi === 1 ? 'chiuso' : 'chiusi'}`,
      `${conclusi} ${conclusi === 1 ? 'concluso' : 'conclusi'}`,
    ].join(' · ');
  });

  ngOnInit(): void {
    this.carica();
  }

  chiudi(t: Torneo): void {
    const ok = confirm(
      `Chiudere le iscrizioni di "${t.nome}"?\nDopo la chiusura nessuno potrà più iscriversi.`
    );
    if (ok) this.cambiaStato(t, 'chiuso', 'Iscrizioni chiuse');
  }

  concludi(t: Torneo): void {
    const ok = confirm(
      `Concludere "${t.nome}"?\nUn torneo concluso non è più modificabile e i punti non si possono più correggere.`
    );
    if (ok) this.cambiaStato(t, 'concluso', 'Torneo concluso');
  }

  modalita(t: Torneo): string {
    if (t.modalita === 'SINGOLO') return 'Singolo';
    if (t.modalita === 'DUO') return 'Duo';
    return `Squadra (${t.giocatoriPerSquadra})`;
  }

  etichettaStato(t: Torneo): string {
    if (t.stato === 'CONCLUSO') return 'Concluso';
    if (t.inCorso) return 'In corso';
    return t.stato === 'APERTO' ? 'Aperto' : 'Chiuso';
  }

  classeStato(t: Torneo): string {
    if (t.stato === 'CONCLUSO') return 'pill pill-concluso';
    if (t.inCorso) return 'pill pill-in-corso';
    return t.stato === 'APERTO' ? 'pill pill-aperto' : 'pill pill-chiuso';
  }

  private cambiaStato(t: Torneo, stato: 'chiuso' | 'concluso', testoOk: string): void {
    this.inCorsoId.set(t.id);
    this.esito.set(null);
    this.admin.cambiaStato(t.id, stato).subscribe({
      next: () => {
        this.inCorsoId.set(null);
        this.esito.set({ ok: true, testo: `${testoOk}: ${t.nome}` });
        this.carica();
      },
      error: (err: HttpErrorResponse) => {
        this.inCorsoId.set(null);
        this.esito.set({ ok: false, testo: `${t.nome}: ${messaggioErrore(err)}` });
      },
    });
  }

  private carica(): void {
    this.admin.getTuttiITornei().subscribe({
      next: (lista) => {
        this.tornei.set(lista);
        this.errore.set(null);
        this.caricamento.set(false);
      },
      error: () => {
        this.errore.set('Impossibile caricare i tornei. Riprova più tardi.');
        this.caricamento.set(false);
      },
    });
  }
}
