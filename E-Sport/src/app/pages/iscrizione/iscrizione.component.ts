import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TorneoDettaglio } from '../../models/torneo.model';
import { messaggioErrore } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { TorneiService } from '../../services/tornei.service';
import { UtenteService } from '../../services/utente.service';

interface Componente {
  email: string;
  controllo: { ok: boolean; testo: string } | null;
}

@Component({
  selector: 'app-iscrizione',
  imports: [RouterLink],
  templateUrl: './iscrizione.component.html',
  styleUrl: './iscrizione.component.css',
})
export class IscrizioneComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private torneiService = inject(TorneiService);
  private utenteService = inject(UtenteService);
  auth = inject(AuthService);

  torneo = signal<TorneoDettaglio | null>(null);
  nomeSquadra = signal('');
  componenti = signal<Componente[]>([]);

  caricamento = signal(true);
  errore = signal<string | null>(null);
  invio = signal(false);
  esito = signal<string | null>(null);

  puoInviare = computed(
    () =>
      this.nomeSquadra().trim().length > 0 &&
      this.componenti().every((c) => c.email !== '' && c.controllo?.ok !== false)
  );

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.torneiService.getTorneo(id).subscribe({
      next: (t) => {
        this.torneo.set(t);
        this.errore.set(this.motivoBlocco(t));
        const posti = Array.from({ length: t.giocatoriPerSquadra - 1 }, () => ({ email: '', controllo: null }));
        this.componenti.set(posti);
        this.caricamento.set(false);
      },
      error: () => {
        this.errore.set('Torneo non trovato.');
        this.caricamento.set(false);
      },
    });
  }

  scriviEmail(indice: number, email: string): void {
    this.aggiorna(indice, { email: email.trim(), controllo: null });
  }

  controlla(indice: number): void {
    const email = this.componenti()[indice].email;
    if (!email) return;

    this.utenteService.cerca(email).subscribe({
      next: (u) => {
        if (this.componenti()[indice].email !== email) return;
        const controllo = u.puoIscriversi
          ? { ok: true, testo: `${u.nome} ${u.cognome}` }
          : { ok: false, testo: 'limite raggiunto' };
        this.aggiorna(indice, { email, controllo });
      },
      error: (err: HttpErrorResponse) => {
        if (this.componenti()[indice].email !== email) return;
        const testo = err.status === 404 ? 'non registrato' : 'controllo non riuscito';
        this.aggiorna(indice, { email, controllo: { ok: false, testo } });
      },
    });
  }

  iscrivi(): void {
    const t = this.torneo();
    if (!t || !this.puoInviare()) return;

    this.invio.set(true);
    this.esito.set(null);
    const squadra = {
      squadraNome: this.nomeSquadra().trim(),
      componenti: this.componenti().map((c) => c.email),
    };
    this.torneiService.iscriviti(t.id, squadra).subscribe({
      next: () => {
        this.invio.set(false);
        this.router.navigate(['/tornei', t.id]);
      },
      error: (err: HttpErrorResponse) => {
        this.invio.set(false);
        this.esito.set(messaggioErrore(err, 'Iscrizione non riuscita'));
      },
    });
  }

  valore(evento: Event): string {
    return (evento.target as HTMLInputElement).value;
  }

  private motivoBlocco(t: TorneoDettaglio): string | null {
    if (t.miaSquadra) return 'Sei già iscritto a questo torneo.';
    if (t.stato !== 'APERTO') return 'Le iscrizioni a questo torneo sono chiuse.';
    if (t.modalita === 'SINGOLO') return 'Questo torneo è singolo: iscriviti dalla pagina del torneo.';
    if (t.iscritti >= t.postiMassimi) return 'Il torneo è completo.';
    return null;
  }

  private aggiorna(indice: number, componente: Componente): void {
    this.componenti.update((lista) => lista.map((c, i) => (i === indice ? componente : c)));
  }
}
