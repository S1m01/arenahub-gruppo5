import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PartitaDettaglioApi, PuntiRichiestaApi } from '../../models/api.model';
import { AdminService, messaggioErrore } from '../../services/admin.service';

interface RigaGiocatore {
  utenteId: number;
  nome: string;
  punti: string;
}

interface RigaSquadra {
  squadraId: number;
  nome: string;
  punti: string;
  giocatori: RigaGiocatore[];
}

const INTERO = /^\d+$/;

@Component({
  selector: 'app-punti',
  imports: [DatePipe, RouterLink],
  templateUrl: './punti.component.html',
  styleUrl: './punti.component.css',
})
export class PuntiComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private admin = inject(AdminService);

  private id = Number(this.route.snapshot.paramMap.get('id'));

  partita = signal<PartitaDettaglioApi | null>(null);
  righe = signal<RigaSquadra[]>([]);
  caricamento = signal(true);
  errore = signal<string | null>(null);
  invio = signal(false);
  esito = signal<{ ok: boolean; testo: string } | null>(null);

  ngOnInit(): void {
    this.admin.getPartita(this.id).subscribe({
      next: (p) => {
        this.imposta(p);
        this.caricamento.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errore.set(
          err.status === 404 ? 'Partita non trovata.' : messaggioErrore(err, 'Impossibile caricare la partita.')
        );
        this.caricamento.set(false);
      },
    });
  }

  salva(concludi: boolean): void {
    const p = this.partita();
    if (!p) return;

    const problema = this.controlla();
    if (problema) {
      this.esito.set({ ok: false, testo: problema });
      return;
    }

    if (concludi && p.stato !== 'conclusa' && !confirm('Concludere la partita? I punti entreranno nelle classifiche.')) {
      return;
    }

    const dati: PuntiRichiestaApi = {
      concludi: concludi || p.stato === 'conclusa',
      squadre: this.righe().map((r) => {
        const conGiocatori = r.giocatori.length > 0 && r.giocatori.every((g) => g.punti.trim() !== '');
        return {
          squadraId: r.squadraId,
          punti: Number(r.punti),
          ...(conGiocatori
            ? { giocatori: r.giocatori.map((g) => ({ utenteId: g.utenteId, punti: Number(g.punti) })) }
            : {}),
        };
      }),
    };

    this.invio.set(true);
    this.esito.set(null);
    this.admin.salvaPunti(this.id, dati).subscribe({
      next: (aggiornata) => {
        this.invio.set(false);
        if (dati.concludi && p.stato !== 'conclusa') {
          this.router.navigate(['/admin/tornei', p.torneoId, 'partite']);
          return;
        }
        this.imposta({ ...p, ...aggiornata, turno: aggiornata.turno ?? p.turno, dataOra: aggiornata.dataOra ?? p.dataOra });
        this.esito.set({ ok: true, testo: 'Punti salvati' });
      },
      error: (err: HttpErrorResponse) => {
        this.invio.set(false);
        this.esito.set({ ok: false, testo: messaggioErrore(err, 'Dati non validi') });
      },
    });
  }

  valore(evento: Event): string {
    return (evento.target as HTMLInputElement).value;
  }

  private controlla(): string | null {
    for (const r of this.righe()) {
      const punti = r.punti.trim();
      if (punti === '') return 'Indicare i punti di tutte le squadre della partita';
      if (!INTERO.test(punti)) return 'Dati non validi: i punti devono essere numeri interi non negativi';

      const compilati = r.giocatori.filter((g) => g.punti.trim() !== '');
      if (compilati.length > 0 && compilati.length < r.giocatori.length) {
        return `${r.nome}: indicare i punti di tutti i componenti della squadra o di nessuno`;
      }
      if (compilati.some((g) => !INTERO.test(g.punti.trim()))) {
        return 'Dati non validi: i punti devono essere numeri interi non negativi';
      }
    }
    return null;
  }

  private imposta(p: PartitaDettaglioApi): void {
    this.partita.set(p);
    this.righe.set(
      p.squadre.map((s) => ({
        squadraId: s.squadraId,
        nome: s.nome,
        punti: s.punti === null ? '' : String(s.punti),
        giocatori: (s.giocatori ?? []).map((g) => ({
          utenteId: g.utenteId,
          nome: `${g.nome} ${g.cognome}`,
          punti: g.punti === null ? '' : String(g.punti),
        })),
      }))
    );
  }
}
