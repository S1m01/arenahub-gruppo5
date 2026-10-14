export interface TorneoApi {
  id: number;
  nome: string;
  descrizione?: string | null;
  gioco: string;
  categoria: string;
  modalita: 'singolo' | 'duo' | 'squadra';
  giocatoriPerSquadra: number;
  stato: 'aperto' | 'chiuso' | 'concluso';
  inCorso?: boolean;
  dataOra: string;
  dataFine: string;
  postiMax: number;
  iscritti: number;
  foto?: string | null;
}

export interface PartitaApi {
  id: number;
  torneoId: number;
  turno: string | null;
  dataOra: string | null;
  stato: 'programmata' | 'conclusa';
  squadre: { squadraId: number; nome: string; punti: number | null }[];
}

export interface GiocataApi {
  id: number;
  torneoId: number;
  torneo: string;
  categoria: string;
  partitaId: number | null;
  turno: string | null;
  titolo: string;
  idYoutube: string;
  inizioSec: number;
  fineSec: number;
  giocatore: string | null;
  squadra: string | null;
}

export interface TorneoRichiestaApi {
  nome: string;
  descrizione: string | null;
  gioco: string;
  categoria: string;
  modalita: 'singolo' | 'duo' | 'squadra';
  giocatoriPerSquadra: number;
  dataOra: string;
  dataFine: string;
  postiMax: number;
  foto: string | null;
}

export interface IscrittiSquadraApi {
  squadraId: number;
  squadra: string;
  capitanoId: number;
  data: string;
  componenti: { utenteId: number; nome: string; cognome: string; email: string }[];
}

export interface PartitaDettaglioApi {
  id: number;
  torneoId: number;
  torneo: string;
  turno: string | null;
  dataOra: string | null;
  stato: 'programmata' | 'conclusa';
  squadre: {
    squadraId: number;
    nome: string;
    punti: number | null;
    giocatori: { utenteId: number; nome: string; cognome: string; punti: number | null }[];
  }[];
}

export interface PuntiRichiestaApi {
  concludi: boolean;
  squadre: {
    squadraId: number;
    punti: number;
    giocatori?: { utenteId: number; punti: number }[];
  }[];
}
