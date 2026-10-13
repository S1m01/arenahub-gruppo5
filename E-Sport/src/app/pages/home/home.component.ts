import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Categoria, Torneo } from '../../models/torneo.model';
import { TorneiService } from '../../services/tornei.service';

type FiltroStato = 'TUTTI' | 'APERTO' | 'CHIUSO' | 'IN_CORSO';
type Ordinamento = 'DATA' | 'NOME' | 'ISCRITTI';

@Component({
  selector: 'app-home',
  imports: [DatePipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private torneiService = inject(TorneiService);

  readonly chiusi = inject(ActivatedRoute).snapshot.data['tipo'] === 'chiusi';

  tornei = signal<Torneo[]>([]);
  categorie = signal<Categoria[]>([]);
  caricamento = signal(true);
  errore = signal<string | null>(null);

  ricerca = signal('');
  categoria = signal('TUTTE');
  stato = signal<FiltroStato>('TUTTI');
  ordine = signal<Ordinamento>('DATA');

  torneiFiltrati = computed(() => {
    const testo = this.ricerca().trim().toLowerCase();
    const cat = this.categoria();
    const st = this.stato();

    const lista = this.tornei().filter((t) => {
      if (testo && !t.nome.toLowerCase().includes(testo)) return false;
      if (cat !== 'TUTTE' && t.categoria !== cat) return false;
      if (st === 'IN_CORSO' && !t.inCorso) return false;
      if (st === 'APERTO' && t.stato !== 'APERTO') return false;
      if (st === 'CHIUSO' && (t.stato !== 'CHIUSO' || t.inCorso)) return false;
      return true;
    });

    switch (this.ordine()) {
      case 'NOME':
        return [...lista].sort((a, b) => a.nome.localeCompare(b.nome));
      case 'ISCRITTI':
        return [...lista].sort((a, b) => b.iscritti - a.iscritti);
      default:
        return [...lista].sort(
          (a, b) => new Date(a.dataInizio).getTime() - new Date(b.dataInizio).getTime(),
        );
    }
  });

  ngOnInit(): void {
    const richiesta = this.chiusi
      ? this.torneiService.getTorneiConclusi()
      : this.torneiService.getTorneiNonConclusi();

    richiesta.subscribe({
      next: (lista) => {
        this.tornei.set(lista);
        this.caricamento.set(false);
      },
      error: () => {
        this.errore.set('Impossibile caricare i tornei. Riprova più tardi.');
        this.caricamento.set(false);
      },
    });

    this.torneiService.getCategorie().subscribe({
      next: (lista) => this.categorie.set(lista),
      error: () => this.categorie.set([]),
    });
  }

  valore(evento: Event): string {
    return (evento.target as HTMLInputElement | HTMLSelectElement).value;
  }

  etichettaModalita(t: Torneo): string {
    switch (t.modalita) {
      case 'SINGOLO':
        return 'Singolo';
      case 'DUO':
        return 'Duo';
      default:
        return `Squadra (${t.giocatoriPerSquadra})`;
    }
  }

  etichettaStato(t: Torneo): string {
    if (t.stato === 'CONCLUSO') return 'Concluso';
    if (t.inCorso) return 'In corso';
    return t.stato === 'APERTO' ? 'Aperto' : 'Chiuso';
  }

  classeStato(t: Torneo): string {
    if (t.stato === 'CONCLUSO') return 'badge concluso';
    if (t.inCorso) return 'badge in-corso';
    return t.stato === 'APERTO' ? 'badge aperto' : 'badge chiuso';
  }

  etichettaPulsante(t: Torneo): string {
    if (t.stato === 'CONCLUSO') return 'Vedi risultati';
    return t.inCorso ? 'Vedi partite' : 'Dettaglio torneo';
  }

  sfondo(t: Torneo): string | null {
    return t.foto ? `url('${t.foto}')` : null;
  }
}
