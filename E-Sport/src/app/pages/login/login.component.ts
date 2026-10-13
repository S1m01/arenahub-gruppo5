import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  invio = signal(false);
  erroreServer = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  accedi(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.invio.set(true);
    this.erroreServer.set(null);

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.invio.set(false);
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.invio.set(false);
        if (err.status === 401) {
          this.erroreServer.set('Email o password errate');
        } else if (err.status === 400) {
          this.erroreServer.set(err.error?.errore ?? 'Dati non validi');
        } else {
          this.erroreServer.set('Errore di connessione al server. Riprova.');
        }
      },
    });
  }

  campoNonValido(nome: 'email' | 'password'): boolean {
    const c = this.form.controls[nome];
    return c.invalid && c.touched;
  }
}
