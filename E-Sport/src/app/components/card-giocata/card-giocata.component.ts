import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Giocata } from '../../models/torneo.model';
import { VideoYoutubeComponent } from '../video-youtube/video-youtube.component';

@Component({
  selector: 'app-card-giocata',
  imports: [RouterLink, VideoYoutubeComponent],
  template: `
    <article class="card">
      <app-video-youtube
        [videoId]="giocata().videoId"
        [inizio]="giocata().inizio"
        [fine]="giocata().fine"
        [titolo]="giocata().titolo"
      />
      <div class="testo">
        <h2 class="titolo">{{ giocata().titolo }}</h2>
        <p class="dettagli">{{ dettagli() }}</p>
        <p class="durata">{{ tempo(giocata().inizio) }} - {{ tempo(giocata().fine) }}</p>
        @if (mostraTorneo()) {
          <a [routerLink]="['/tornei', giocata().torneoId]" class="vai">Vai al torneo ›</a>
        }
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
    }
    .card {
      height: 100%;
      padding: 12px;
      background: var(--superficie);
      border: 1px solid var(--bordo);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .testo {
      padding: 0 4px 4px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .titolo {
      margin: 0;
      font-size: 1.05rem;
      text-transform: none;
      letter-spacing: normal;
    }
    .dettagli,
    .durata {
      margin: 0;
      color: var(--testo-tenue);
      font-size: 0.9rem;
    }
    .durata {
      font-variant-numeric: tabular-nums;
      font-size: 0.8rem;
    }
    .vai {
      margin-top: 6px;
      align-self: flex-start;
      color: var(--testo);
      font-weight: 800;
      font-size: 0.82rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      text-decoration: none;
    }
    .vai:hover {
      text-decoration: underline;
    }
  `,
})
export class CardGiocataComponent {
  giocata = input.required<Giocata>();
  mostraTorneo = input(true);

  dettagli = computed(() => {
    const g = this.giocata();
    const parti = this.mostraTorneo() ? [g.torneo, g.turno, g.giocatore] : [g.turno, g.giocatore];
    return parti.filter(Boolean).join(' · ');
  });

  tempo(secondi: number): string {
    const s = Math.max(0, Math.floor(secondi));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }
}
