import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  TestRequest,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { TorneoApi } from '../models/api.model';

/** Provider comuni ai test delle pagine admin: router finto, HTTP finto e (facoltativo) :id nella rotta. */
export function providerAdmin(id?: number) {
  return [
    provideRouter([]),
    provideHttpClient(),
    provideHttpClientTesting(),
    ...(id === undefined
      ? []
      : [
          {
            provide: ActivatedRoute,
            useValue: { snapshot: { paramMap: convertToParamMap({ id: String(id) }) } },
          },
        ]),
  ];
}

export function http(): HttpTestingController {
  return TestBed.inject(HttpTestingController);
}

export function torneoApi(campi: Partial<TorneoApi> = {}): TorneoApi {
  return {
    id: 4,
    nome: "Lega R6 d'autunno",
    descrizione: 'Gironi',
    gioco: 'Rainbow Six',
    categoria: 'Sparatutto',
    modalita: 'squadra',
    giocatoriPerSquadra: 3,
    stato: 'chiuso',
    inCorso: false,
    dataOra: '2026-10-10T21:00:00',
    dataFine: '2026-10-20T23:00:00',
    postiMax: 4,
    iscritti: 3,
    foto: 'img/R6.png',
    ...campi,
  };
}

/** Risponde a una richiesta con un errore nel formato del contratto: {"errore": "..."}. */
export function rispondiErrore(req: TestRequest, stato: number, testo: string): void {
  req.flush({ errore: testo }, { status: stato, statusText: 'Errore' });
}

/** Testo visibile del componente, senza spazi multipli. */
export function testo(el: HTMLElement): string {
  return (el.textContent ?? '').replace(/\s+/g, ' ').trim();
}

/** Scrive in un input e lancia l'evento, come farebbe l'utente. */
export function scrivi(el: HTMLElement, selettore: string, valore: string): void {
  const campo = el.querySelector(selettore) as HTMLInputElement | HTMLSelectElement;
  campo.value = valore;
  campo.dispatchEvent(new Event(campo.tagName === 'SELECT' ? 'change' : 'input'));
}
