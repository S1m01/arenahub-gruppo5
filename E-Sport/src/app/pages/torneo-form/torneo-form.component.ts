import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TorneoRichiestaApi } from '../../models/api.model';
import { TorneoDettaglio } from '../../models/torneo.model';
import { AdminService, messaggioErrore } from '../../services/admin.service';
import { TorneiService } from '../../services/tornei.service';

type ModalitaForm = 'singolo' | 'duo' | 'squadra';
type Campo = keyof TorneoFormComponent['form']['controls'];

const FOTO_DISPONIBILI = [
  'img/fifa.png',
  'img/fortnite.png',
  'img/lol.png',
  'img/R6.png',
  'img/rocket.png',
  'img/street.png',
  'img/mortal.png',
  'img/clashroyale.png',
];

function dateCoerenti(gruppo: AbstractControl): ValidationErrors | null {
  const inizio = gruppo.get('dataOra')?.value;
  const fine = gruppo.get('dataFine')?.value;
  return inizio && fine && fine < inizio ? { dateIncoerenti: true } : null;
}

@Component({
  selector: 'app-torneo-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './torneo-form.component.html',
  styleUrl: './torneo-form.component.css',
})
export class TorneoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private admin = inject(AdminService);
  private torneiService = inject(TorneiService);

  readonly foto = FOTO_DISPONIBILI;

  id: number | null = null;
  torneo = signal<TorneoDettaglio | null>(null);
  categorie = signal<string[]>([]);
  caricamento = signal(false);
  erroreCaricamento = signal<string | null>(null);
  invio = signal(false);
  erroreServer = signal<string | null>(null);

  form = this.fb.nonNullable.group(
    {
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      descrizione: [''],
      gioco: ['', [Validators.required, Validators.maxLength(80)]],
      categoria: ['', Validators.required],
      modalita: ['singolo' as ModalitaForm, Validators.required],
      giocatoriPerSquadra: [1, Validators.required],
      dataOra: ['', Validators.required],
      dataFine: ['', Validators.required],
      postiMax: [16, [Validators.required, Validators.min(1)]],
      foto: ['', Validators.maxLength(255)],
    },
    { validators: dateCoerenti }
  );

  constructor() {
    this.form.controls.modalita.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((m) => this.adattaGiocatori(m));
  }

  ngOnInit(): void {
    this.torneiService.getCategorie().subscribe({
      next: (lista) => {
        this.categorie.set(lista);
        if (!this.id && !this.form.controls.categoria.value && lista.length > 0) {
          this.form.controls.categoria.setValue(lista[0]);
        }
      },
      error: () => this.categorie.set([]),
    });

    const param = this.route.snapshot.paramMap.get('id');
    if (param === null) {
      this.adattaGiocatori('singolo');
      return;
    }

    this.id = Number(param);
    this.caricamento.set(true);
    this.torneiService.getTorneo(this.id).subscribe({
      next: (t) => {
        this.torneo.set(t);
        this.riempi(t);
        this.caricamento.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.erroreCaricamento.set(
          err.status === 404 ? 'Torneo non trovato.' : 'Impossibile caricare il torneo. Riprova più tardi.'
        );
        this.caricamento.set(false);
      },
    });
  }

  salva(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // getRawValue include anche i campi disattivati (modalità bloccata con iscritti presenti).
    const v = this.form.getRawValue();
    const dati: TorneoRichiestaApi = {
      nome: v.nome.trim(),
      descrizione: v.descrizione.trim() || null,
      gioco: v.gioco.trim(),
      categoria: v.categoria,
      modalita: v.modalita,
      giocatoriPerSquadra: Number(v.giocatoriPerSquadra),
      dataOra: conSecondi(v.dataOra),
      dataFine: conSecondi(v.dataFine),
      postiMax: Number(v.postiMax),
      foto: v.foto.trim() || null,
    };

    this.invio.set(true);
    this.erroreServer.set(null);
    const richiesta = this.id ? this.admin.modificaTorneo(this.id, dati) : this.admin.creaTorneo(dati);

    richiesta.subscribe({
      next: () => {
        this.invio.set(false);
        this.router.navigate(['/admin']);
      },
      error: (err: HttpErrorResponse) => {
        this.invio.set(false);
        this.erroreServer.set(messaggioErrore(err, 'Dati non validi'));
      },
    });
  }

  nonValido(nome: Campo): boolean {
    const c = this.form.controls[nome];
    return c.invalid && c.touched;
  }

  dateIncoerenti(): boolean {
    return this.form.hasError('dateIncoerenti') && this.form.controls.dataFine.touched;
  }

  etichettaPosti(): string {
    return this.form.controls.modalita.value === 'singolo'
      ? 'Posti massimi (giocatori)'
      : 'Posti massimi (squadre)';
  }

  conIscritti(): boolean {
    return (this.torneo()?.iscritti ?? 0) > 0;
  }

  // Singolo = 1 e duo = 2 giocatori fissi; squadra almeno 3 (come chiede il contratto).
  private adattaGiocatori(m: ModalitaForm): void {
    const g = this.form.controls.giocatoriPerSquadra;
    if (m === 'squadra') {
      g.setValidators([Validators.required, Validators.min(3), Validators.max(100)]);
      if (g.value < 3) g.setValue(5);
      g.enable({ emitEvent: false });
    } else {
      g.setValidators(Validators.required);
      g.setValue(m === 'duo' ? 2 : 1);
      g.disable({ emitEvent: false });
    }
    g.updateValueAndValidity({ emitEvent: false });
  }

  private riempi(t: TorneoDettaglio): void {
    const modalita = t.modalita.toLowerCase() as ModalitaForm;
    this.form.patchValue({
      nome: t.nome,
      descrizione: t.descrizione ?? '',
      gioco: t.gioco,
      categoria: t.categoria,
      modalita,
      dataOra: t.dataInizio.slice(0, 16),
      dataFine: t.dataFine.slice(0, 16),
      postiMax: t.postiMassimi,
      foto: t.foto ?? '',
    });
    this.adattaGiocatori(modalita);
    this.form.controls.giocatoriPerSquadra.setValue(t.giocatoriPerSquadra);

    // Con iscritti il backend rifiuta il cambio di modalità e posti sotto gli iscritti (422).
    if (t.iscritti > 0) {
      this.form.controls.modalita.disable({ emitEvent: false });
      this.form.controls.giocatoriPerSquadra.disable({ emitEvent: false });
      this.form.controls.postiMax.addValidators(Validators.min(t.iscritti));
      this.form.controls.postiMax.updateValueAndValidity();
    }
    if (t.stato === 'CONCLUSO') this.form.disable({ emitEvent: false });
  }
}

// L'input datetime-local dà "2026-10-16T15:00": si aggiungono i secondi per l'ISO completo.
function conSecondi(valore: string): string {
  return valore.length === 16 ? `${valore}:00` : valore;
}
