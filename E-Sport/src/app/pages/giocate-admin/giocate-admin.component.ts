import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Giocata, Partita, Squadra, TorneoDettaglio } from '../../models/torneo.model';
import { AdminService, messaggioErrore } from '../../services/admin.service';
import { GiocateService } from '../../services/giocate.service';
import { TorneiService } from '../../services/tornei.service';

const ID_VIDEO = /^[A-Za-z0-9_-]{11}$/;

@Component({
  selector: 'app-giocate-admin',
  imports: [RouterLink],
  templateUrl: './giocate-admin.component.html',
  styleUrl: './giocate-admin.component.css',
})
export class GiocateAdminComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private admin = inject(AdminService);
  private torneiService = inject(TorneiService);
  private giocateService = inject(GiocateService);

  private id = Number(this.route.snapshot.paramMap.get('id'));

  torneo = signal<TorneoDettaglio | null>(null);
  giocate = signal<Giocata[]>([]);
  partite = signal<Partita[]>([]);
  squadre = signal<Squadra[]>([]);
  caricamento = signal(true);
  errore = signal<string | null>(null);
  erroreElenco = signal<string | null>(null);
  eliminazione = signal<number | null>(null);

  link = signal('');
  titolo = signal('');
  inizio = signal('');
  fine = signal('');
  partitaId = signal('');
  utenteId = signal('');
  invio = signal(false);
  esito = signal<{ ok: boolean; testo: string } | null>(null);

  idVideo = computed(() => (this.link().trim() ? idDaLinkYoutube(this.link()) : null));

  giocatori = computed(() => {
    const visti = new Map<number, string>();
    for (const s of this.squadre()) {
      for (const c of s.componenti) visti.set(c.utenteId, `${c.nome} ${c.cognome} (${s.nome})`);
    }
    return [...visti].map(([id, nome]) => ({ id, nome })).sort((a, b) => a.nome.localeCompare(b.nome));
  });

  ngOnInit(): void {
    forkJoin({
      torneo: this.torneiService.getTorneo(this.id),
      giocate: this.giocateService.getGiocate(this.id),
      partite: this.torneiService.getPartite(this.id),
      squadre: this.torneiService.getSquadre(this.id),
    }).subscribe({
      next: ({ torneo, giocate, partite, squadre }) => {
        this.torneo.set(torneo);
        this.giocate.set(giocate);
        this.partite.set(partite);
        this.squadre.set(squadre);
        this.caricamento.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errore.set(
          err.status === 404 ? 'Torneo non trovato.' : messaggioErrore(err, 'Impossibile caricare le giocate.')
        );
        this.caricamento.set(false);
      },
    });
  }

  aggiungi(): void {
    const youtubeId = this.idVideo();
    const titolo = this.titolo().trim();
    const inizioSec = daMinSec(this.inizio());
    const fineSec = daMinSec(this.fine());

    let problema: string | null = null;
    if (!youtubeId) problema = 'Link YouTube non valido';
    else if (!titolo) problema = 'Inserisci il titolo';
    else if (inizioSec === null || fineSec === null) problema = 'Tempi non validi: usa il formato min:sec (es. 1:30)';
    else if (fineSec <= inizioSec) problema = "La fine deve essere dopo l'inizio";
    if (problema || !youtubeId || inizioSec === null || fineSec === null) {
      this.esito.set({ ok: false, testo: problema ?? 'Dati non validi' });
      return;
    }

    this.invio.set(true);
    this.esito.set(null);
    this.admin
      .aggiungiGiocata(this.id, {
        titolo,
        youtubeId,
        inizioSec,
        fineSec,
        partitaId: this.partitaId() ? Number(this.partitaId()) : null,
        utenteId: this.utenteId() ? Number(this.utenteId()) : null,
      })
      .subscribe({
        next: () => {
          this.invio.set(false);
          this.esito.set({ ok: true, testo: 'Giocata aggiunta' });
          this.link.set('');
          this.titolo.set('');
          this.inizio.set('');
          this.fine.set('');
          this.partitaId.set('');
          this.utenteId.set('');
          this.giocateService.getGiocate(this.id).subscribe((g) => this.giocate.set(g));
        },
        error: (err: HttpErrorResponse) => {
          this.invio.set(false);
          this.esito.set({ ok: false, testo: messaggioErrore(err, 'Dati non validi') });
        },
      });
  }

  elimina(g: Giocata): void {
    if (!confirm(`Eliminare la giocata "${g.titolo}"?`)) return;

    this.eliminazione.set(g.id);
    this.erroreElenco.set(null);
    this.admin.eliminaGiocata(g.id).subscribe({
      next: () => {
        this.eliminazione.set(null);
        this.giocate.update((lista) => lista.filter((x) => x.id !== g.id));
      },
      error: (err: HttpErrorResponse) => {
        this.eliminazione.set(null);
        this.erroreElenco.set(`${g.titolo}: ${messaggioErrore(err)}`);
      },
    });
  }

  tempo(secondi: number): string {
    const s = Math.max(0, Math.floor(secondi));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  valore(evento: Event): string {
    return (evento.target as HTMLInputElement | HTMLSelectElement).value;
  }
}

function daMinSec(testo: string): number | null {
  const t = testo.trim();
  const m = /^(\d+):([0-5]\d)$/.exec(t);
  if (m) return Number(m[1]) * 60 + Number(m[2]);
  return /^\d+$/.test(t) ? Number(t) : null;
}

function idDaLinkYoutube(link: string): string | null {
  const testo = link.trim();
  if (ID_VIDEO.test(testo)) return testo;
  try {
    const url = new URL(testo);
    const host = url.hostname.replace(/^(www|m)\./, '');
    let id: string | null = null;
    if (host === 'youtu.be') id = url.pathname.slice(1);
    else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      id = url.searchParams.get('v') ?? url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ?? null;
    }
    return id && ID_VIDEO.test(id) ? id : null;
  } catch {
    return null;
  }
}
