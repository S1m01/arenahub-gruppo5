import { GiocataApi, PartitaApi, TorneoApi } from '../models/api.model';
import { Giocata, Modalita, Partita, StatoTorneo, TorneoDettaglio } from '../models/torneo.model';

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
    inCorso: stato === 'CHIUSO' && adesso >= inizio && adesso <= fine,
    foto: t.foto ?? null,
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
    categoria: g.categoria,
    partitaId: g.partitaId,
    turno: g.turno,
    titolo: g.titolo,
    videoId: g.idYoutube,
    inizio: g.inizioSec,
    fine: g.fineSec,
    giocatore: g.giocatore,
    squadra: g.squadra,
  };
}
