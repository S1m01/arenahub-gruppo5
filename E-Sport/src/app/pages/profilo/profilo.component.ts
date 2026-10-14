import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MiaPartita, MioTorneo, Statistiche } from '../../models/torneo.model';
import { Utente } from '../../services/auth.service';
import { UtenteService } from '../../services/utente.service';

type FiltroPartite = 'TUTTE' | 'PROGRAMMATE' | 'CONCLUSE';

@Component({
  selector: 'app-profilo',
  imports: [DatePipe, RouterLink],
  templateUrl: './profilo.component.html',
  styleUrl: './profilo.component.css',
})
export class ProfiloComponent implements OnInit {
  private utenteService = inject(UtenteService);

  utente = signal<Utente | null>(null);
  statistiche = signal<Statistiche | null>(null);
  tornei = signal<MioTorneo[]>([]);
  partite = signal<MiaPartita[]>([]);
  filtro = signal<FiltroPartite>('TUTTE');

  caricamento = signal(true);
  errore = signal<string | null>(null);

  readonly filtri: { id: FiltroPartite; label: string }[] = [
    { id: 'TUTTE', label: 'Tutte' },
    { id: 'PROGRAMMATE', label: 'Programmate' },
    { id: 'CONCLUSE', label: 'Concluse' },
  ];

  ngOnInit(): void {
    this.utenteService.getMe().subscribe({
      next: (u) => {
        this.utente.set(u);
        this.caricamento.set(false);
      },
      error: () => {
        this.errore.set('Impossibile caricare il profilo. Riprova più tardi.');
        this.caricamento.set(false);
      },
    });
    this.utenteService.getStatistiche().subscribe({
      next: (s) => this.statistiche.set(s),
      error: () => this.statistiche.set(null),
    });
    this.utenteService.getMieiTornei().subscribe({
      next: (t) => this.tornei.set(t),
      error: () => this.tornei.set([]),
    });
    this.caricaPartite();
  }

  scegliFiltro(filtro: FiltroPartite): void {
    this.filtro.set(filtro);
    this.caricaPartite();
  }

  etichettaStato(t: MioTorneo): string {
    if (t.stato === 'CONCLUSO') return 'Concluso';
    if (t.inCorso) return 'In corso';
    return t.stato === 'APERTO' ? 'Aperto' : 'Chiuso';
  }

  risultato(p: MiaPartita): string {
    if (p.stato !== 'CONCLUSA') return p.squadre.map((s) => s.nome).join(' - ');
    return p.squadre.map((s) => `${s.nome} ${s.punti ?? 0}`).join(' - ');
  }

  private caricaPartite(): void {
    const filtro = this.filtro();
    const stato = filtro === 'PROGRAMMATE' ? 'programmata' : filtro === 'CONCLUSE' ? 'conclusa' : undefined;
    this.utenteService.getMiePartite(stato).subscribe({
      next: (p) => this.partite.set(p),
      error: () => this.partite.set([]),
    });
  }
}
