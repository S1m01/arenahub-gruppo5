import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Partita, Squadra, TorneoDettaglio } from '../../models/torneo.model';
import { AdminService, messaggioErrore } from '../../services/admin.service';
import { TorneiService } from '../../services/tornei.service';

@Component({
  selector: 'app-partite',
  imports: [DatePipe, RouterLink],
  templateUrl: './partite.component.html',
  styleUrl: './partite.component.css',
})
export class PartiteComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private admin = inject(AdminService);
  private torneiService = inject(TorneiService);

  private id = Number(this.route.snapshot.paramMap.get('id'));

  torneo = signal<TorneoDettaglio | null>(null);
  partite = signal<Partita[]>([]);
  squadre = signal<Squadra[]>([]);
  caricamento = signal(true);
  errore = signal<string | null>(null);

  turno = signal('');
  dataOra = signal('');
  scelte = signal<Set<number>>(new Set());
  invio = signal(false);
  esito = signal<{ ok: boolean; testo: string } | null>(null);

  ngOnInit(): void {
    forkJoin({
      torneo: this.torneiService.getTorneo(this.id),
      partite: this.torneiService.getPartite(this.id),
      squadre: this.torneiService.getSquadre(this.id),
    }).subscribe({
      next: ({ torneo, partite, squadre }) => {
        this.torneo.set(torneo);
        this.partite.set(partite);
        this.squadre.set(squadre);
        this.caricamento.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errore.set(
          err.status === 404 ? 'Torneo non trovato.' : messaggioErrore(err, 'Impossibile caricare le partite.')
        );
        this.caricamento.set(false);
      },
    });
  }

  alterna(squadraId: number): void {
    this.scelte.update((s) => {
      const nuovo = new Set(s);
      if (nuovo.has(squadraId)) nuovo.delete(squadraId);
      else nuovo.add(squadraId);
      return nuovo;
    });
  }

  crea(): void {
    if (this.scelte().size < 2) {
      this.esito.set({ ok: false, testo: 'Una partita richiede almeno 2 squadre' });
      return;
    }

    const data = this.dataOra();
    this.invio.set(true);
    this.esito.set(null);
    this.admin
      .creaPartita(this.id, {
        turno: this.turno().trim() || null,
        dataOra: data ? (data.length === 16 ? `${data}:00` : data) : null,
        squadre: [...this.scelte()],
      })
      .subscribe({
        next: () => {
          this.invio.set(false);
          this.esito.set({ ok: true, testo: 'Partita creata' });
          this.turno.set('');
          this.dataOra.set('');
          this.scelte.set(new Set());
          this.torneiService.getPartite(this.id).subscribe((p) => this.partite.set(p));
        },
        error: (err: HttpErrorResponse) => {
          this.invio.set(false);
          this.esito.set({ ok: false, testo: messaggioErrore(err, 'Dati non validi') });
        },
      });
  }

  sfidanti(p: Partita): string {
    return p.squadre
      .map((s) => (p.stato === 'CONCLUSA' ? `${s.nome} ${s.punti ?? 0}` : s.nome))
      .join(' - ');
  }

  valore(evento: Event): string {
    return (evento.target as HTMLInputElement).value;
  }
}
