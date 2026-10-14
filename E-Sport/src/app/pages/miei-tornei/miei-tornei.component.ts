import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardTorneoComponent } from '../../components/card-torneo/card-torneo.component';
import { MioTorneo, Statistiche } from '../../models/torneo.model';
import { messaggioErrore } from '../../services/admin.service';
import { UtenteService } from '../../services/utente.service';

@Component({
  selector: 'app-miei-tornei',
  imports: [CardTorneoComponent, RouterLink],
  templateUrl: './miei-tornei.component.html',
  styleUrl: './miei-tornei.component.css',
})
export class MieiTorneiComponent implements OnInit {
  private utenteService = inject(UtenteService);

  tornei = signal<MioTorneo[]>([]);
  statistiche = signal<Statistiche | null>(null);
  caricamento = signal(true);
  errore = signal<string | null>(null);
  esito = signal<{ ok: boolean; testo: string } | null>(null);
  inAnnullamento = signal<number | null>(null);

  ngOnInit(): void {
    this.carica();
  }

  puoAnnullare(t: MioTorneo): boolean {
    return t.stato === 'APERTO' && t.squadra.sonoCapitano;
  }

  annulla(t: MioTorneo): void {
    if (!confirm(`Vuoi annullare l'iscrizione a "${t.nome}"?`)) return;

    this.inAnnullamento.set(t.id);
    this.esito.set(null);
    this.utenteService.annullaIscrizione(t.id).subscribe({
      next: () => {
        this.inAnnullamento.set(null);
        this.esito.set({ ok: true, testo: `Iscrizione a "${t.nome}" annullata` });
        this.carica();
      },
      error: (err: HttpErrorResponse) => {
        this.inAnnullamento.set(null);
        this.esito.set({ ok: false, testo: messaggioErrore(err, 'Annullamento non riuscito') });
      },
    });
  }

  private carica(): void {
    this.utenteService.getMieiTornei().subscribe({
      next: (t) => {
        this.tornei.set(t);
        this.caricamento.set(false);
      },
      error: () => {
        this.errore.set('Impossibile caricare i tuoi tornei. Riprova più tardi.');
        this.caricamento.set(false);
      },
    });
    this.utenteService.getStatistiche().subscribe({
      next: (s) => this.statistiche.set(s),
      error: () => this.statistiche.set(null),
    });
  }
}
