export interface TorneoApi {
  id: number;
  nome: string;
  descrizione?: string | null;
  gioco: string;
  categoria: string;
  modalita: 'singolo' | 'duo' | 'squadra';
  giocatoriPerSquadra: number;
  stato: 'aperto' | 'chiuso' | 'concluso';
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
