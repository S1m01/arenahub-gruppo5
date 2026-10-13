import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

type Campo = 'nome' | 'cognome' | 'email' | 'password';

@Component({
  selector: 'app-registrazione',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registrazione.component.html',
  styleUrl: './registrazione.component.css',
})
export class RegistrazioneComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  invio = signal(false);
  erroreServer = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(50)]],
    cognome: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  registrati(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.invio.set(true);
    this.erroreServer.set(null);

    const { nome, cognome, email, password } = this.form.getRawValue();
    const dati = { nome: nome.trim(), cognome: cognome.trim(), email: email.trim(), password };

    this.auth.registrazione(dati).subscribe({
      // Dopo la registrazione si entra già loggati
      next: () => {
        this.invio.set(false);
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.invio.set(false);
        if (err.status === 409) {
          this.erroreServer.set(err.error?.errore ?? 'Email già in uso');
        } else if (err.status === 400) {
          this.erroreServer.set(err.error?.errore ?? 'Dati non validi');
        } else {
          this.erroreServer.set('Errore di connessione al server. Riprova.');
        }
      },
    });
  }

  campoNonValido(nome: Campo): boolean {
    const c = this.form.controls[nome];
    return c.invalid && c.touched;
  }

  messaggioErrore(nome: Campo): string {
    const c = this.form.controls[nome];
    if (c.hasError('required')) {
      return {
        nome: 'Inserisci il nome',
        cognome: 'Inserisci il cognome',
        email: 'Inserisci la tua email',
        password: 'Inserisci una password',
      }[nome];
    }
    if (c.hasError('email')) return 'Email non valida';
    if (c.hasError('minlength')) return 'Almeno 8 caratteri';
    if (c.hasError('maxlength')) return 'Massimo 50 caratteri';
    return '';
  }
}
