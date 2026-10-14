import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { messaggioErrore } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { UtenteService } from '../../services/utente.service';

@Component({
  selector: 'app-modifica-profilo',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './modifica-profilo.component.html',
  styleUrl: './modifica-profilo.component.css',
})
export class ModificaProfiloComponent implements OnInit {
  private utenteService = inject(UtenteService);
  private auth = inject(AuthService);

  profilo = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    cognome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  });

  password = new FormGroup({
    passwordAttuale: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    passwordNuova: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  caricamento = signal(true);
  errore = signal<string | null>(null);
  invioProfilo = signal(false);
  invioPassword = signal(false);
  esitoProfilo = signal<{ ok: boolean; testo: string } | null>(null);
  esitoPassword = signal<{ ok: boolean; testo: string } | null>(null);

  ngOnInit(): void {
    this.utenteService.getMe().subscribe({
      next: (u) => {
        this.profilo.setValue({ nome: u.nome, cognome: u.cognome, email: u.email ?? '' });
        this.caricamento.set(false);
      },
      error: () => {
        this.errore.set('Impossibile caricare il profilo. Riprova più tardi.');
        this.caricamento.set(false);
      },
    });
  }

  salvaProfilo(): void {
    if (this.profilo.invalid) {
      this.profilo.markAllAsTouched();
      return;
    }

    this.invioProfilo.set(true);
    this.esitoProfilo.set(null);
    this.utenteService.modificaProfilo(this.profilo.getRawValue()).subscribe({
      next: (u) => {
        this.invioProfilo.set(false);
        this.auth.aggiorna(u);
        this.esitoProfilo.set({ ok: true, testo: 'Profilo aggiornato' });
      },
      error: (err: HttpErrorResponse) => {
        this.invioProfilo.set(false);
        this.esitoProfilo.set({ ok: false, testo: messaggioErrore(err, 'Dati non validi') });
      },
    });
  }

  cambiaPassword(): void {
    if (this.password.invalid) {
      this.password.markAllAsTouched();
      return;
    }

    this.invioPassword.set(true);
    this.esitoPassword.set(null);
    this.utenteService.cambiaPassword(this.password.getRawValue()).subscribe({
      next: () => {
        this.invioPassword.set(false);
        this.password.reset();
        this.esitoPassword.set({ ok: true, testo: 'Password cambiata' });
      },
      error: (err: HttpErrorResponse) => {
        this.invioPassword.set(false);
        this.esitoPassword.set({ ok: false, testo: messaggioErrore(err, 'Dati non validi') });
      },
    });
  }

  nonValido(gruppo: FormGroup, campo: string): boolean {
    const controllo = gruppo.get(campo);
    return !!controllo && controllo.invalid && controllo.touched;
  }
}
