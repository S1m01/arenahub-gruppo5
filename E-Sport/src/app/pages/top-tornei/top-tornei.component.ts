import { Component, OnInit, inject, signal } from '@angular/core';
import { CardTorneoComponent } from '../../components/card-torneo/card-torneo.component';
import { Torneo } from '../../models/torneo.model';
import { TorneiService } from '../../services/tornei.service';

@Component({
  selector: 'app-top-tornei',
  imports: [CardTorneoComponent],
  templateUrl: './top-tornei.component.html',
  styleUrl: './top-tornei.component.css',
})
export class TopTorneiComponent implements OnInit {
  private torneiService = inject(TorneiService);

  tornei = signal<Torneo[]>([]);
  caricamento = signal(true);
  errore = signal<string | null>(null);

  ngOnInit(): void {
    this.torneiService.getTopTornei().subscribe({
      next: (lista) => {
        this.tornei.set([...lista].sort((a, b) => b.iscritti - a.iscritti).slice(0, 3));
        this.caricamento.set(false);
      },
      error: () => {
        this.errore.set('Impossibile caricare i top tornei. Riprova più tardi.');
        this.caricamento.set(false);
      },
    });
  }
}
