import { Component, HostListener, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  tendinaAperta = signal(false);

  /** true sulle pagine "Tornei aperti" e "Tornei chiusi": evidenzia la voce TORNEI */
  sezioneTornei = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => this.eSezioneTornei(e.urlAfterRedirects))
    ),
    { initialValue: this.eSezioneTornei(this.router.url) }
  );

  /** Voci di menu: per ora solo visibili, non cliccabili (pagine non ancora sviluppate). */
  readonly vociFuture = [
    { label: 'Top giocate', tendina: false },
    { label: 'Classifica', tendina: true },
    { label: 'Top tornei', tendina: false },
    { label: 'Live', tendina: false },
  ];

  apriChiudiTendina(evento: MouseEvent): void {
    evento.stopPropagation();
    this.tendinaAperta.update((aperta) => !aperta);
  }

  chiudiTendina(): void {
    this.tendinaAperta.set(false);
  }

  /** Chiude la tendina cliccando fuori o premendo Esc */
  @HostListener('document:click')
  @HostListener('document:keydown.escape')
  chiudiDaFuori(): void {
    this.tendinaAperta.set(false);
  }

  esci(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  private eSezioneTornei(url: string): boolean {
    const percorso = url.split(/[?#]/)[0];
    return percorso === '/' || percorso === '/tornei-chiusi';
  }
}
