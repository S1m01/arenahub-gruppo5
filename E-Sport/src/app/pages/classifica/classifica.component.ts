import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Categoria, PosizioneClassifica } from '../../models/torneo.model';
import { ClassificaService } from '../../services/classifica.service';
import { TorneiService } from '../../services/tornei.service';

type TipoClassifica = 'generale' | 'categoria' | 'top';

@Component({
  selector: 'app-classifica',
  imports: [RouterLink],
  templateUrl: './classifica.component.html',
  styleUrl: './classifica.component.css',
})
export class ClassificaComponent implements OnInit {
  private classificaService = inject(ClassificaService);
  private torneiService = inject(TorneiService);

  readonly tipo: TipoClassifica = inject(ActivatedRoute).snapshot.data['tipo'] ?? 'generale';

  readonly titolo = {
    generale: 'Classifica generale',
    categoria: 'Classifica per categoria',
    top: 'Classifica top - I primi 3',
  }[this.tipo];

  righe = signal<PosizioneClassifica[]>([]);
  categorie = signal<Categoria[]>([]);
  categoria = signal('');
  caricamento = signal(true);
  errore = signal<string | null>(null);

  podio = computed(() => {
    const [primo, secondo, terzo] = this.righe();
    return [
      { riga: secondo, classe: 'secondo' },
      { riga: primo, classe: 'primo' },
      { riga: terzo, classe: 'terzo' },
    ].filter((p) => !!p.riga);
  });

  ngOnInit(): void {
    if (this.tipo !== 'categoria') {
      this.carica(
        this.tipo === 'top' ? this.classificaService.getTop() : this.classificaService.getGenerale()
      );
      return;
    }

    this.torneiService.getCategorie().subscribe({
      next: (lista) => {
        this.categorie.set(lista);
        if (lista.length === 0) {
          this.caricamento.set(false);
          return;
        }
        this.scegliCategoria(lista[0].nome);
      },
      error: () => {
        this.errore.set('Impossibile caricare le categorie. Riprova più tardi.');
        this.caricamento.set(false);
      },
    });
  }

  scegliCategoria(nome: string): void {
    this.categoria.set(nome);
    this.carica(this.classificaService.getPerCategoria(nome));
  }

  valore(evento: Event): string {
    return (evento.target as HTMLSelectElement).value;
  }

  private carica(richiesta: Observable<PosizioneClassifica[]>): void {
    this.caricamento.set(true);
    this.errore.set(null);
    richiesta.subscribe({
      next: (lista) => {
        this.righe.set(this.tipo === 'top' ? lista.slice(0, 3) : lista);
        this.caricamento.set(false);
      },
      error: () => {
        this.righe.set([]);
        this.errore.set('Impossibile caricare la classifica. Riprova più tardi.');
        this.caricamento.set(false);
      },
    });
  }
}
