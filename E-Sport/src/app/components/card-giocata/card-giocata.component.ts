import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Giocata } from '../../models/torneo.model';
import { VideoYoutubeComponent } from '../video-youtube/video-youtube.component';

@Component({
  selector: 'app-card-giocata',
  imports: [RouterLink, VideoYoutubeComponent],
  template: `
    <article class="riquadro">
      <app-video-youtube
        [videoId]="giocata().videoId"
        [inizio]="giocata().inizio"
        [fine]="giocata().fine"
        [titolo]="giocata().titolo"
      />
      <h2 class="titolo-video">{{ giocata().titolo }}</h2>
      <p class="info-video">{{ dettagli() }}</p>
      <p class="info-video durata">{{ tempo(giocata().inizio) }} - {{ tempo(giocata().fine) }}</p>
      @if (mostraTorneo()) {
        <a class="indietro" [routerLink]="['/tornei', giocata().torneoId]">Vai al torneo ›</a>
      }
    </article>
  `,
  styles: `
    :host {
      display: block;
    }
    .riquadro {
      height: 100%;
      gap: 8px;
    }
    app-video-youtube {
      margin-bottom: 6px;
    }
    .titolo-video {
      margin: 0;
      font-family: var(--font-titoli);
      font-weight: 400;
      font-size: 1.05rem;
      text-transform: uppercase;
    }
    .info-video {
      margin: 0;
      color: var(--testo-2);
      font-size: 0.9rem;
    }
    .durata {
      font-variant-numeric: tabular-nums;
    }
    .indietro {
      margin-top: auto;
      align-self: flex-start;
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
