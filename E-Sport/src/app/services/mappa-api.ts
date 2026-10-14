import { GiocataApi, MiaPartitaApi, MioTorneoApi, PartitaApi, TorneoApi } from '../models/api.model';
import {
  Giocata,
  MiaPartita,
  MioTorneo,
  Modalita,
  Partita,
  StatoTorneo,
  TorneoDettaglio,
} from '../models/torneo.model';

export function daTorneoApi(t: TorneoApi, adesso = Date.now()): TorneoDettaglio {
  const stato = t.stato.toUpperCase() as StatoTorneo;
  const inizio = new Date(t.dataOra).getTime();
  const fine = new Date(t.dataFine).getTime();
  return {
    id: t.id,
    nome: t.nome,
    descrizione: t.descrizione ?? null,
    gioco: t.gioco,
    categoria: t.categoria,
    modalita: t.modalita.toUpperCase() as Modalita,
    giocatoriPerSquadra: t.giocatoriPerSquadra,
    dataInizio: t.dataOra,
    dataFine: t.dataFine,
    iscritti: t.iscritti,
    postiMassimi: t.postiMax,
    stato,
    inCorso: t.inCorso ?? (stato === 'CHIUSO' && adesso >= inizio && adesso <= fine),
    foto: t.foto ?? null,
    miaSquadra: t.miaSquadra ?? null,
  };
}

export function daMioTorneoApi(t: MioTorneoApi): MioTorneo {
  return {
    ...daTorneoApi(t),
    squadra: t.squadra,
    dataIscrizione: t.dataIscrizione,
    punti: t.punti,
    posizione: t.posizione,
  };
}

export function daMiaPartitaApi(p: MiaPartitaApi): MiaPartita {
  return {
    ...daPartitaApi(p),
    torneo: p.torneo,
    miaSquadraId: p.miaSquadraId,
    mieiPunti: p.mieiPunti,
  };
}

export function daPartitaApi(p: PartitaApi): Partita {
  return {
    id: p.id,
    torneoId: p.torneoId,
    turno: p.turno ?? '',
    dataOra: p.dataOra ?? '',
    stato: p.stato === 'conclusa' ? 'CONCLUSA' : 'PROGRAMMATA',
    squadre: p.squadre,
  };
}

export function daGiocataApi(g: GiocataApi): Giocata {
  return {
    id: g.id,
    torneoId: g.torneoId,
    torneo: g.torneo,
    partitaId: g.partitaId,
    turno: g.turno,
    titolo: g.titolo,
    videoId: g.youtubeId,
    inizio: g.inizioSec,
    fine: g.fineSec,
    utenteId: g.utenteId,
    giocatore: g.giocatore,
  };
}
