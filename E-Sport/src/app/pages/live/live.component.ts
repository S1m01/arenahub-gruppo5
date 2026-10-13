import { Component, OnInit, inject, signal } from '@angular/core';
import { CardTorneoComponent } from '../../components/card-torneo/card-torneo.component';
import { DirettaTwitchComponent } from '../../components/diretta-twitch/diretta-twitch.component';
import { Torneo } from '../../models/torneo.model';
import { TorneiService } from '../../services/tornei.service';

@Component({
  selector: 'app-live',
  imports: [CardTorneoComponent, DirettaTwitchComponent],
  templateUrl: './live.component.html',
  styleUrl: './live.component.css',
})
export class LiveComponent implements OnInit {
  private torneiService = inject(TorneiService);

  readonly canaleTwitch = 'riberaribell';

  tornei = signal<Torneo[]>([]);
  caricamento = signal(true);
  errore = signal<string | null>(null);

  ngOnInit(): void {
    this.torneiService.getTorneiLive().subscribe({
      next: (lista) => {
        this.tornei.set(lista.map((t) => ({ ...t, inCorso: true })));
        this.caricamento.set(false);
      },
      error: () => {
        this.errore.set('Impossibile caricare i tornei in corso. Riprova più tardi.');
        this.caricamento.set(false);
      },
    });
  }
}
