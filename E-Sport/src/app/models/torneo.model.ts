// Allinea i nomi dei campi a docs/api.md se differiscono.

export type Modalita = 'SINGOLO' | 'DUO' | 'SQUADRA';
export type StatoTorneo = 'APERTO' | 'CHIUSO' | 'CONCLUSO';

export interface Torneo {
  id: number;
  nome: string;
  gioco: string;
  categoria: string;
  modalita: Modalita;
  giocatoriPerSquadra: number;
  dataInizio: string; // ISO 8601
  dataFine: string;   // ISO 8601
  iscritti: number;
  postiMassimi: number;
  stato: StatoTorneo;
  inCorso: boolean;
  foto: string | null; // es. "img/calcio.jpg"
}

export interface Categoria {
  id: number;
  nome: string;
}
