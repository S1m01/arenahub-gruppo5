import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

const ID_VALIDO = /^[A-Za-z0-9_-]{11}$/;

@Component({
  selector: 'app-video-youtube',
  template: `
    @if (url(); as indirizzo) {
      <iframe
        [src]="indirizzo"
        [title]="titolo()"
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        referrerpolicy="strict-origin-when-cross-origin"
      ></iframe>
    } @else {
      <div class="non-disponibile">Video non disponibile</div>
    }
  `,
  styles: `
    :host {
      display: block;
      aspect-ratio: 16 / 9;
      border-radius: 10px;
      overflow: hidden;
      background: var(--notte-2);
    }
    iframe {
      width: 100%;
      height: 100%;
      border: 0;
      display: block;
    }
    .non-disponibile {
      height: 100%;
      display: grid;
      place-items: center;
      color: var(--testo-2);
      font-family: var(--font-titoli);
      font-size: 0.8rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
  `,
})
export class VideoYoutubeComponent {
  private sanitizer = inject(DomSanitizer);

  videoId = input.required<string>();
  inizio = input(0);
  fine = input<number | null>(null);
  titolo = input('Video YouTube');

  url = computed<SafeResourceUrl | null>(() => {
    const id = this.videoId();
    if (!ID_VALIDO.test(id)) return null;

    const params = new URLSearchParams({ rel: '0' });
    const inizio = Math.max(0, Math.floor(this.inizio()));
    if (inizio > 0) params.set('start', String(inizio));
    const fine = this.fine();
    if (fine !== null && Math.floor(fine) > inizio) params.set('end', String(Math.floor(fine)));

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${id}?${params}`
    );
  });
}
