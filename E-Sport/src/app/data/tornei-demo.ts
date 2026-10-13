import {
  Categoria,
  Giocata,
  Partita,
  PosizioneClassifica,
  PosizioneGiocatore,
  PosizioneSquadra,
  Squadra,
  TorneoDettaglio,
} from '../models/torneo.model';

export const TORNEI_DEMO: TorneoDettaglio[] = [
  {
    id: 1,
    nome: 'Torneo FIFA',
    gioco: 'EA Sports FC 26',
    categoria: 'Calcio',
    modalita: 'SINGOLO',
    giocatoriPerSquadra: 1,
    dataInizio: '2026-10-24T15:00:00',
    dataFine: '2026-10-24T20:00:00',
    iscritti: 6,
    postiMassimi: 16,
    stato: 'APERTO',
    inCorso: false,
    foto: 'img/fifa.png',
    descrizione: '1 vs 1 a eliminazione diretta. Partite da 6 minuti per tempo, in caso di pareggio si va ai rigori.',
  },
  {
    id: 2,
    nome: 'Torneo Warzone',
    gioco: 'Call of Duty: Warzone',
    categoria: 'Sparatutto',
    modalita: 'SQUADRA',
    giocatoriPerSquadra: 4,
    dataInizio: '2026-10-31T16:00:00',
    dataFine: '2026-10-31T22:00:00',
    iscritti: 3,
    postiMassimi: 12,
    stato: 'APERTO',
    inCorso: false,
    foto: 'img/warzone.webp',
    descrizione: 'Battle royale a squadre da 4: vince l\'ultima squadra rimasta in piedi.',
  },
  {
    id: 3,
    nome: 'Torneo Briscola',
    gioco: 'Briscola',
    categoria: 'Carte',
    modalita: 'DUO',
    giocatoriPerSquadra: 2,
    dataInizio: '2026-10-03T15:00:00',
    dataFine: '2026-10-03T19:00:00',
    iscritti: 4,
    postiMassimi: 8,
    stato: 'CONCLUSO',
    inCorso: false,
    foto: 'img/briscola.webp',
    descrizione: 'A coppie, eliminazione diretta. Vince la mano chi supera i 61 punti.',
  },
  {
    id: 4,
    nome: 'Torneo Pallavolo',
    gioco: 'Pallavolo',
    categoria: 'Sport',
    modalita: 'SQUADRA',
    giocatoriPerSquadra: 6,
    dataInizio: '2026-09-27T09:00:00',
    dataFine: '2026-09-27T18:00:00',
    iscritti: 4,
    postiMassimi: 8,
    stato: 'CONCLUSO',
    inCorso: false,
    foto: 'img/pallavolo.webp',
    descrizione: 'Squadre miste da 6 giocatori, partite al meglio dei 3 set. Il punteggio indica i punti fatti in tutta la partita.',
  },
];

const idUtenti = new Map<string, number>();

function idUtente(nomeCompleto: string): number {
  if (!idUtenti.has(nomeCompleto)) idUtenti.set(nomeCompleto, 100 + idUtenti.size);
  return idUtenti.get(nomeCompleto)!;
}

function squadra(id: number, nome: string, giocatori: string[]): Squadra {
  const componenti = giocatori.map((g) => {
    const [nomeG, cognome] = g.split(' ');
    return { utenteId: idUtente(g), nome: nomeG, cognome };
  });
  return { id, nome, capitanoId: componenti[0].utenteId, componenti };
}

const SQUADRE_DEMO: Record<number, Squadra[]> = {
  1: [
    squadra(11, 'Mario Rossi', ['Mario Rossi']),
    squadra(12, 'Luca Verdi', ['Luca Verdi']),
    squadra(13, 'Sara Neri', ['Sara Neri']),
    squadra(14, 'Paolo Gallo', ['Paolo Gallo']),
    squadra(15, 'Elena Conti', ['Elena Conti']),
    squadra(16, 'Marco Riva', ['Marco Riva']),
  ],
  2: [
    squadra(21, 'Team Alfa', ['Giulia Bianchi', 'Andrea Marino', 'Davide Greco', 'Chiara Ricci']),
    squadra(22, 'Team Beta', ['Matteo Lombardi', 'Federica Costa', 'Simone Fontana', 'Alessia Moretti']),
    squadra(23, 'Team Gamma', ['Lorenzo Barbieri', 'Martina Rinaldi', 'Riccardo Caruso', 'Giorgia Ferri']),
  ],
  3: [
    squadra(31, 'I Carichi', ['Mario Rossi', 'Luca Verdi']),
    squadra(32, 'Asso Pigliatutto', ['Sara Neri', 'Paolo Gallo']),
    squadra(33, 'Re di Denari', ['Elena Conti', 'Marco Riva']),
    squadra(34, 'Settebello', ['Giulia Bianchi', 'Andrea Marino']),
  ],
  4: [
    squadra(41, 'Muro Alto', ['Luca Verdi', 'Chiara Ricci', 'Matteo Lombardi', 'Federica Costa', 'Simone Fontana', 'Alessia Moretti']),
    squadra(42, 'Schiacciasassi', ['Lorenzo Barbieri', 'Martina Rinaldi', 'Riccardo Caruso', 'Giorgia Ferri', 'Tommaso Gatti', 'Ilaria Testa']),
    squadra(43, 'Bagher Boys', ['Sara Neri', 'Valentina Pellegrini', 'Fabio Vitale', 'Roberta Leone', 'Stefano Longo', 'Silvia Mancini']),
    squadra(44, 'Set Point', ['Giulia Bianchi', 'Laura Martini', 'Giacomo Sala', 'Beatrice Fabbri', 'Emanuele Bruno', 'Camilla Villa']),
  ],
};

function partita(
  id: number,
  torneoId: number,
  turno: string,
  dataOra: string,
  a: [number, number | null],
  b: [number, number | null]
): Partita {
  const nomi = new Map(SQUADRE_DEMO[torneoId].map((s) => [s.id, s.nome]));
  return {
    id,
    torneoId,
    turno,
    dataOra,
    stato: a[1] === null ? 'PROGRAMMATA' : 'CONCLUSA',
    squadre: [a, b].map(([squadraId, punti]) => ({
      squadraId,
      nome: nomi.get(squadraId) ?? '',
      punti,
    })),
  };
}

const PARTITE_DEMO: Record<number, Partita[]> = {
  3: [
    partita(301, 3, 'Semifinale 1', '2026-10-03T15:00:00', [31, 68], [32, 52]),
    partita(302, 3, 'Semifinale 2', '2026-10-03T15:00:00', [33, 47], [34, 73]),
    partita(303, 3, 'Finale', '2026-10-03T17:30:00', [31, 64], [34, 56]),
  ],
  4: [
    partita(401, 4, 'Semifinale 1', '2026-09-27T09:00:00', [41, 63], [42, 58]),
    partita(402, 4, 'Semifinale 2', '2026-09-27T11:00:00', [43, 41], [44, 50]),
    partita(403, 4, 'Finale 3° posto', '2026-09-27T14:00:00', [42, 50], [43, 44]),
    partita(404, 4, 'Finale', '2026-09-27T16:00:00', [41, 57], [44, 62]),
  ],
};

export function categorieDemo(): Categoria[] {
  const nomi = [...new Set(TORNEI_DEMO.map((t) => t.categoria))];
  return nomi.map((nome, i) => ({ id: i + 1, nome }));
}

export function squadreDemo(torneoId: number): Squadra[] {
  return SQUADRE_DEMO[torneoId] ?? [];
}

export function partiteDemo(torneoId: number): Partita[] {
  return PARTITE_DEMO[torneoId] ?? [];
}

function conPosizioni<T extends { punti: number }>(righe: T[]): (T & { posizione: number })[] {
  const ordinate = [...righe].sort((a, b) => b.punti - a.punti);
  return ordinate.map((r) => ({
    ...r,
    posizione: ordinate.findIndex((o) => o.punti === r.punti) + 1,
  }));
}

export function classificaDemo(torneoId: number): PosizioneSquadra[] {
  const totali = new Map<number, { squadraId: number; squadra: string; punti: number; partiteGiocate: number }>();
  for (const s of squadreDemo(torneoId)) {
    totali.set(s.id, { squadraId: s.id, squadra: s.nome, punti: 0, partiteGiocate: 0 });
  }
  for (const p of partiteDemo(torneoId).filter((p) => p.stato === 'CONCLUSA')) {
    for (const s of p.squadre) {
      const riga = totali.get(s.squadraId);
      if (riga) {
        riga.punti += s.punti ?? 0;
        riga.partiteGiocate++;
      }
    }
  }
  return conPosizioni([...totali.values()]);
}

export function classificaGiocatoriDemo(torneoId: number): PosizioneGiocatore[] {
  const puntiSquadra = new Map(classificaDemo(torneoId).map((r) => [r.squadraId, r.punti]));
  const righe = squadreDemo(torneoId).flatMap((s) =>
    s.componenti.map((c) => ({
      utenteId: c.utenteId,
      giocatore: `${c.nome} ${c.cognome}`,
      squadra: s.nome,
      punti: puntiSquadra.get(s.id) ?? 0,
    }))
  );
  return conPosizioni(righe);
}

export function classificaGeneraleDemo(categoria?: string): PosizioneClassifica[] {
  const totali = new Map<number, { utenteId: number; giocatore: string; punti: number }>();
  const tornei = TORNEI_DEMO.filter(
    (t) => !categoria || t.categoria.toLowerCase() === categoria.toLowerCase()
  );
  for (const t of tornei) {
    for (const g of classificaGiocatoriDemo(t.id)) {
      const riga = totali.get(g.utenteId) ?? { utenteId: g.utenteId, giocatore: g.giocatore, punti: 0 };
      riga.punti += g.punti;
      totali.set(g.utenteId, riga);
    }
  }
  return conPosizioni([...totali.values()].filter((r) => r.punti > 0));
}

function giocata(
  id: number,
  partitaId: number,
  titolo: string,
  videoId: string,
  inizio: number,
  fine: number,
  giocatore: string | null,
  squadra: string
): Giocata {
  const partita = Object.values(PARTITE_DEMO)
    .flat()
    .find((p) => p.id === partitaId)!;
  const torneo = TORNEI_DEMO.find((t) => t.id === partita.torneoId)!;
  return {
    id,
    torneoId: torneo.id,
    torneo: torneo.nome,
    categoria: torneo.categoria,
    partitaId,
    turno: partita.turno,
    titolo,
    videoId,
    inizio,
    fine,
    giocatore,
    squadra,
  };
}

const GIOCATE_DEMO: Giocata[] = [
  giocata(1, 303, 'Carico calato al momento giusto', 'IHQ3EzR2WAY', 90, 135, 'Mario Rossi', 'I Carichi'),
  giocata(2, 302, 'Briscola da maestro', 'UTol-og6JVk', 5, 40, 'Giulia Bianchi', 'Settebello'),
  giocata(3, 303, 'Rimonta finale', 'IHQ3EzR2WAY', 300, 345, null, 'Settebello'),
  giocata(4, 401, 'Muro decisivo', 'gg-ciHf1YXU', 42, 65, 'Luca Verdi', 'Muro Alto'),
  giocata(5, 404, 'Difesa impossibile', 'hK5ljlhoADs', 190, 230, 'Giulia Bianchi', 'Set Point'),
  giocata(6, 403, 'Azione di squadra', 'G7BPunIQgD4', 10, 50, null, 'Schiacciasassi'),
];

export function giocateDemo(torneoId?: number): Giocata[] {
  return GIOCATE_DEMO.filter((g) => torneoId === undefined || g.torneoId === torneoId);
}
