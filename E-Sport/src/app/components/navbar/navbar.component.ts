import { Component, HostListener, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from '../../services/auth.service';

interface VoceTendina {
  label: string;
  link: string;
}

interface VoceMenu {
  label: string;
  link?: string;
  tendina?: VoceTendina[];
  sezione?: (percorso: string) => boolean;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  tendinaAperta = signal<string | null>(null);

  percorso = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => this.soloPercorso(e.urlAfterRedirects))
    ),
    { initialValue: this.soloPercorso(this.router.url) }
  );

  readonly voci: VoceMenu[] = [
    {
      label: 'Tornei',
      tendina: [
        { label: 'Tornei aperti', link: '/' },
        { label: 'Tornei chiusi', link: '/tornei-chiusi' },
      ],
      sezione: (p) => p === '/' || p === '/tornei-chiusi' || p.startsWith('/tornei/'),
    },
    { label: 'Top giocate' },
    {
      label: 'Classifica',
      tendina: [
        { label: 'Classifica generale', link: '/classifica' },
        { label: 'Classifica per categoria', link: '/classifica/categoria' },
        { label: 'Classifica top', link: '/classifica/top' },
      ],
      sezione: (p) => p === '/classifica' || p.startsWith('/classifica/'),
    },
    { label: 'Top tornei', link: '/top-tornei' },
    { label: 'Live', link: '/live' },
  ];

  attiva(voce: VoceMenu): boolean {
    return voce.sezione?.(this.percorso()) ?? false;
  }

  apriChiudiTendina(voce: VoceMenu, evento: MouseEvent): void {
    evento.stopPropagation();
    this.tendinaAperta.update((aperta) => (aperta === voce.label ? null : voce.label));
  }

  chiudiTendina(): void {
    this.tendinaAperta.set(null);
  }

  @HostListener('document:click')
  @HostListener('document:keydown.escape')
  chiudiDaFuori(): void {
    this.tendinaAperta.set(null);
  }

  esci(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  private soloPercorso(url: string): string {
    return url.split(/[?#]/)[0];
  }
}
