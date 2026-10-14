import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CardGiocataComponent } from '../../components/card-giocata/card-giocata.component';
import { Giocata } from '../../models/torneo.model';
import { GiocateService } from '../../services/giocate.service';
import { TorneiService } from '../../services/tornei.service';

@Component({
  selector: 'app-top-giocate',
  imports: [CardGiocataComponent],
  templateUrl: './top-giocate.component.html',
  styleUrl: './top-giocate.component.css',
})
export class TopGiocateComponent implements OnInit {
  private giocateService = inject(GiocateService);
  private torneiService = inject(TorneiService);

  giocate = signal<Giocata[]>([]);
  categorie = signal<string[]>([]);
  caricamento = signal(true);
  errore = signal<string | null>(null);

  torneo = signal('TUTTI');
  categoria = signal('TUTTE');

  tornei = computed(() => {
    const visti = new Map<number, string>();
    for (const g of this.giocate()) visti.set(g.torneoId, g.torneo);
    return [...visti].map(([id, nome]) => ({ id, nome }));
  });

  giocateFiltrate = computed(() => {
    const torneo = this.torneo();
    return this.giocate().filter((g) => torneo === 'TUTTI' || String(g.torneoId) === torneo);
  });

  ngOnInit(): void {
    this.caricaGiocate();

    this.torneiService.getCategorie().subscribe({
      next: (lista) => this.categorie.set(lista),
      error: () => this.categorie.set([]),
    });
  }

  cambiaCategoria(categoria: string): void {
    this.categoria.set(categoria);
    this.torneo.set('TUTTI');
    this.caricaGiocate();
  }

  caricaGiocate(): void {
    const categoria = this.categoria() === 'TUTTE' ? undefined : this.categoria();
    this.caricamento.set(true);
    this.errore.set(null);
    this.giocateService.getGiocate(undefined, categoria).subscribe({
      next: (lista) => {
        this.giocate.set(lista);
        this.caricamento.set(false);
      },
      error: () => {
        this.errore.set('Impossibile caricare le top giocate. Riprova più tardi.');
        this.caricamento.set(false);
      },
    });
  }

  valore(evento: Event): string {
    return (evento.target as HTMLSelectElement).value;
  }
}
