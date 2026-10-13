import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

const CANALE_VALIDO = /^[A-Za-z0-9_]{3,25}$/;

@Component({
  selector: 'app-diretta-twitch',
  template: `
    @if (indirizzi(); as url) {
      <div class="diretta">
        <div class="player">
          <iframe
            [src]="url.player"
            [title]="'Diretta Twitch di ' + canale()"
            allow="autoplay; fullscreen"
            allowfullscreen
          ></iframe>
        </div>
        <div class="chat">
          <iframe [src]="url.chat" [title]="'Chat Twitch di ' + canale()"></iframe>
        </div>
      </div>
      <a class="link" [href]="url.canale" target="_blank" rel="noopener noreferrer"
        >Apri su Twitch ›</a
      >
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .diretta {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 340px;
      border-radius: 12px;
      overflow: hidden;
      background: #0e0e10;
      border: 1px solid var(--bordo);
    }
    .player {
      aspect-ratio: 16 / 9;
    }
    .chat {
      border-left: 1px solid #26262c;
    }
    iframe {
      width: 100%;
      height: 100%;
      border: 0;
      display: block;
    }
    .link {
      display: inline-block;
      margin-top: 10px;
      color: #9146ff;
      font-weight: 800;
      font-size: 0.85rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      text-decoration: none;
    }
    .link:hover {
      text-decoration: underline;
    }
    @media (max-width: 900px) {
      .diretta {
        grid-template-columns: 1fr;
      }
      .chat {
        height: 380px;
        border-left: 0;
        border-top: 1px solid #26262c;
      }
    }
  `,
})
export class DirettaTwitchComponent {
  private sanitizer = inject(DomSanitizer);
  private document = inject(DOCUMENT);

  canale = input.required<string>();

  indirizzi = computed(() => {
    const canale = this.canale();
    const parent = this.document.location?.hostname;
    if (!CANALE_VALIDO.test(canale) || !parent) return null;

    const sicuro = (url: string): SafeResourceUrl =>
      this.sanitizer.bypassSecurityTrustResourceUrl(url);
    const p = encodeURIComponent(parent);

    return {
      player: sicuro(`https://player.twitch.tv/?channel=${canale}&parent=${p}&muted=true`),
      chat: sicuro(`https://www.twitch.tv/embed/${canale}/chat?parent=${p}`),
      canale: `https://www.twitch.tv/${canale}`,
    };
  });
}
