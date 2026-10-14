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
  miaSquadra?: MiaSquadra | null;
}

export interface MiaSquadra {
  id: number;
  nome: string;
  sonoCapitano: boolean;
}

export interface MioTorneo extends Torneo {
  squadra: MiaSquadra;
  dataIscrizione: string;
  punti: number | null;
  posizione: number | null;
}

export interface MiaPartita extends Partita {
  torneo: string;
  miaSquadraId: number;
  mieiPunti: number | null;
}

export interface Statistiche {
  punti: number;
  posizione: number | null;
  tornei: number;
  torniAttivi: number;
  maxTorneiAttivi: number;
  partiteGiocate: number;
  partiteDaGiocare: number;
  perCategoria: { categoria: string; punti: number; posizione: number }[];
}

export interface UtenteCercato {
  utenteId: number;
  nome: string;
  cognome: string;
  puoIscriversi: boolean;
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
  partitaId: number | null;
  turno: string | null;
  titolo: string;
  videoId: string;
  inizio: number;
  fine: number;
  utenteId: number | null;
  giocatore: string | null;
}
