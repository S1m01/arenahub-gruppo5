export type Modalita = 'SINGOLO' | 'DUO' | 'SQUADRA';
export type StatoTorneo = 'APERTO' | 'CHIUSO' | 'CONCLUSO';
export type StatoPartita = 'PROGRAMMATA' | 'CONCLUSA';

export interface Torneo {
  id: number;
  nome: string;
  gioco: string;
  categoria: string;
  modalita: Modalita;
  giocatoriPerSquadra: number;
  dataInizio: string;
  dataFine: string;
  iscritti: number;
  postiMassimi: number;
  stato: StatoTorneo;
  inCorso: boolean;
  foto: string | null;
}

export interface TorneoDettaglio extends Torneo {
  descrizione: string | null;
}

export interface Componente {
  utenteId: number;
  nome: string;
  cognome: string;
}

export interface Squadra {
  id: number;
  nome: string;
  capitanoId: number;
  componenti: Componente[];
}

export interface PartitaSquadra {
  squadraId: number;
  nome: string;
  punti: number | null;
}

export interface Partita {
  id: number;
  torneoId: number;
  turno: string;
  dataOra: string;
  stato: StatoPartita;
  squadre: PartitaSquadra[];
}

export interface PosizioneSquadra {
  posizione: number;
  squadraId: number;
  squadra: string;
  punti: number;
  partiteGiocate: number;
}

export interface PosizioneClassifica {
  posizione: number;
  utenteId: number;
  giocatore: string;
  punti: number;
}

export interface PosizioneGiocatore {
  posizione: number;
  utenteId: number;
  giocatore: string;
  squadra: string;
  punti: number;
}

export interface Giocata {
  id: number;
  torneoId: number;
  torneo: string;
  categoria: string;
  partitaId: number | null;
  turno: string | null;
  titolo: string;
  videoId: string;
  inizio: number;
  fine: number;
  giocatore: string | null;
  squadra: string | null;
}
