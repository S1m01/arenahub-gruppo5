import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService, messaggioErrore } from '../../services/admin.service';

@Component({
  selector: 'app-impostazioni',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './impostazioni.component.html',
  styleUrl: './impostazioni.component.css',
})
export class ImpostazioniComponent implements OnInit {
  private admin = inject(AdminService);

  // Stessi limiti del backend: intero da 1 a 3.
  limite = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(1),
    Validators.max(3),
    Validators.pattern(/^\d+$/),
  ]);
  caricamento = signal(true);
  errore = signal<string | null>(null);
  invio = signal(false);
  esito = signal<{ ok: boolean; testo: string } | null>(null);

  ngOnInit(): void {
    this.admin.getImpostazioni().subscribe({
      next: (i) => {
        this.limite.setValue(i.maxTorneiAttivi);
        this.caricamento.set(false);
      },
      error: () => {
        this.errore.set('Impossibile caricare le impostazioni. Riprova più tardi.');
        this.caricamento.set(false);
      },
    });
  }

  salva(): void {
    if (this.limite.invalid) {
      this.limite.markAsTouched();
      return;
    }

    this.invio.set(true);
    this.esito.set(null);
    this.admin.salvaImpostazioni(Number(this.limite.value)).subscribe({
      next: (i) => {
        this.invio.set(false);
        this.limite.setValue(i.maxTorneiAttivi);
        this.esito.set({ ok: true, testo: `Limite salvato: ${i.maxTorneiAttivi} tornei attivi per utente` });
      },
      error: (err: HttpErrorResponse) => {
        this.invio.set(false);
        this.esito.set({ ok: false, testo: messaggioErrore(err, 'Dati non validi') });
      },
    });
  }
}
