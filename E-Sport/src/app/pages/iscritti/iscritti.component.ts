import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { IscrittiSquadraApi } from '../../models/api.model';
import { TorneoDettaglio } from '../../models/torneo.model';
import { AdminService, messaggioErrore } from '../../services/admin.service';
import { TorneiService } from '../../services/tornei.service';

@Component({
  selector: 'app-iscritti',
  imports: [DatePipe, RouterLink],
  templateUrl: './iscritti.component.html',
  styleUrl: './iscritti.component.css',
})
export class IscrittiComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private admin = inject(AdminService);
  private torneiService = inject(TorneiService);

  torneo = signal<TorneoDettaglio | null>(null);
  squadre = signal<IscrittiSquadraApi[]>([]);
  caricamento = signal(true);
  errore = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    forkJoin({
      torneo: this.torneiService.getTorneo(id),
      squadre: this.admin.getIscritti(id),
    }).subscribe({
      next: ({ torneo, squadre }) => {
        this.torneo.set(torneo);
        this.squadre.set(squadre);
        this.caricamento.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errore.set(
          err.status === 404 ? 'Torneo non trovato.' : messaggioErrore(err, 'Impossibile caricare gli iscritti.')
        );
        this.caricamento.set(false);
      },
    });
  }

  capitano(s: IscrittiSquadraApi): string {
    const c = s.componenti.find((x) => x.utenteId === s.capitanoId);
    return c ? `${c.nome} ${c.cognome}` : '-';
  }

  riepilogo(t: TorneoDettaglio): string {
    const stato =
      t.stato === 'CONCLUSO' ? 'Concluso' : t.inCorso ? 'In corso' : t.stato === 'APERTO' ? 'Aperto' : 'Chiuso';
    const chi = t.modalita === 'SINGOLO' ? 'giocatori' : 'squadre';
    return `${stato} · ${t.iscritti} ${chi} su ${t.postiMassimi} posti`;
  }
}
