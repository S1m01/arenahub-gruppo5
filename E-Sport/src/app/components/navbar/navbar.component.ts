import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  /** Voci di menu: per ora solo visibili, non cliccabili (pagine non ancora sviluppate). */
  readonly voci = [
    { label: 'Tornei', tendina: true },
    { label: 'Top giocate', tendina: false },
    { label: 'Classifica', tendina: true },
    { label: 'Top tornei', tendina: false },
    { label: 'Live', tendina: false },
  ];

  esci(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
