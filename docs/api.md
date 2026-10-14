# ArenaHub - Contratto API v1

Convenzioni comuni:
- Nomi dei campi in camelCase
- Date in formato ISO 8601
- Elenchi restituiti come array JSON
- Errori sempre nella forma {"errore": "..."}
- Autenticazione: sessione aperta dal login (cookie di sessione)
- Mappatura tra colonne del DB e campi JSON concordata con il DB admin
- Il partecipante di un torneo è sempre una squadra (nei tornei singoli è una squadra da 1 giocatore)
- Nelle classifiche contano solo le partite concluse
- `stato` del torneo: aperto, chiuso o concluso. `inCorso` (true/false) è derivato, non è una colonna del DB: vale true solo se `stato` è chiuso e l'ora attuale è tra `dataOra` e `dataFine`. Il frontend mostra l'etichetta APERTO / CHIUSO / IN CORSO (se `inCorso` è true) / CONCLUSO
- Le top giocate sono clip di un video YouTube: si salvano solo l'ID del video e i secondi di inizio e fine, il video non viene scaricato

## Indice degli endpoint

| Metodo | Path | Descrizione | Accesso |
|--------|------|-------------|---------|
| POST | /api/auth/registrazione | Registrazione nuovo utente | pubblico |
| POST | /api/auth/login | Login, apre la sessione | pubblico |
| POST | /api/auth/logout | Logout, chiude la sessione | utente |
| GET | /api/auth/me | Dati dell'utente loggato | utente |
| GET | /api/categorie | Elenco categorie | pubblico |
| GET | /api/tornei | Elenco dei tornei, filtri opzionali | pubblico |
| GET | /api/tornei/top | I 3 tornei con più iscritti | pubblico |
| GET | /api/tornei/live | Tornei in corso adesso (inCorso = true) | pubblico |
| GET | /api/tornei/{id} | Dettaglio di un torneo | pubblico |
| POST | /api/tornei | Creazione di un torneo | admin |
| PUT | /api/tornei/{id} | Modifica di un torneo | admin |
| PATCH | /api/tornei/{id}/stato | Cambio di stato (chiusura, conclusione) | admin |
| GET | /api/tornei/{id}/squadre | Squadre iscritte a un torneo | pubblico |
| POST | /api/tornei/{id}/iscrizioni | Iscrizione dell'utente loggato (crea la squadra) | utente |
| DELETE | /api/tornei/{id}/iscrizioni | Annullamento dell'iscrizione | utente |
| GET | /api/utenti/me/tornei | "I miei tornei" | utente |
| GET | /api/utenti/cerca | Cerca un utente per email (controllo componenti squadra, anche limite tornei attivi) | utente |
| GET | /api/utenti/me/statistiche | Profilo: punti, posizioni, tornei e partite, tornei attivi e limite | utente |
| GET | /api/utenti/me/partite | Profilo: le mie partite con i miei punti | utente |
| PUT | /api/utenti/me | Profilo: modifica nome, cognome, email | utente |
| PUT | /api/utenti/me/password | Profilo: cambio password | utente |
| GET | /api/tornei/{id}/iscritti | Elenco iscritti di un torneo | admin |
| GET | /api/tornei/{id}/partite | Partite di un torneo | pubblico |
| POST | /api/tornei/{id}/partite | Creazione di una partita | admin |
| GET | /api/partite/{id} | Dettaglio di una partita | pubblico |
| PUT | /api/partite/{id}/punti | Inserimento punti, conclusione della partita | admin |
| GET | /api/giocate | Top giocate (clip video), filtro per torneo o categoria | pubblico |
| POST | /api/tornei/{id}/giocate | Aggiunta di una top giocata a un torneo | admin |
| DELETE | /api/giocate/{id} | Eliminazione di una top giocata | admin |
| GET | /api/tornei/{id}/classifica | Classifica delle squadre di un torneo | pubblico |
| GET | /api/tornei/{id}/classifica-giocatori | Classifica dei giocatori di un torneo | pubblico |
| GET | /api/classifica | Classifica generale | pubblico |
| GET | /api/classifica/top | Primi 3 della classifica generale | pubblico |
| GET | /api/classifica/categorie/{categoria} | Classifica di una categoria | pubblico |
| GET | /api/impostazioni | Impostazioni del sito (limite di tornei attivi per utente) | pubblico |
| PUT | /api/impostazioni | Modifica delle impostazioni (limite di tornei attivi) | admin |

---

## POST /api/auth/registrazione
Registrazione nuovo utente. Il ruolo è sempre "utente" (l'admin si assegna dal seed). Accesso: pubblico.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| nome | body | stringa | sì |
| cognome | body | stringa | sì |
| email | body | stringa | sì |
| password | body | stringa | sì |

**Risposta 201**
{ "id": 12, "nome": "Mario", "cognome": "Rossi", "email": "mario@mail.it", "ruolo": "utente" }

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | campi mancanti o email non valida | {"errore": "Dati non validi"} |
| 409 | email già registrata | {"errore": "Email già in uso"} |

## POST /api/auth/login
Login, apre la sessione. Accesso: pubblico.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| email | body | stringa | sì |
| password | body | stringa | sì |

**Risposta 200**
{ "id": 12, "nome": "Mario", "cognome": "Rossi", "ruolo": "utente" }

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | campi mancanti | {"errore": "Dati non validi"} |
| 401 | credenziali errate | {"errore": "Email o password errate"} |

## POST /api/auth/logout
Chiude la sessione. Accesso: utente.

**Risposta 204** (nessun contenuto)

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |

## GET /api/auth/me
Dati dell'utente loggato (serve all'header: nome utente e "Esci", e alla pagina profilo). Accesso: utente.

**Risposta 200**
{ "id": 12, "nome": "Mario", "cognome": "Rossi", "email": "mario@mail.it", "ruolo": "utente" }

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |

---

## GET /api/categorie
Elenco delle categorie (filtro e classifica per categoria). Accesso: pubblico.

**Risposta 200**
[ "Sparatutto", "Calcio" ]

## GET /api/tornei
Elenco dei tornei con i posti occupati. Accesso: pubblico.
Pagina "Tornei aperti": stato=aperto,chiuso (tornei non conclusi, ognuno con la sua etichetta APERTO / CHIUSO / IN CORSO). Pagina "Tornei chiusi": stato=concluso.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| stato | query | uno o più valori separati da virgola (aperto, chiuso, concluso) | no |
| inCorso | query | true / false: solo i tornei in corso (o solo quelli non in corso) | no |
| gioco | query | stringa (bonus) | no |
| categoria | query | stringa (bonus) | no |
| cerca | query | stringa, ricerca per nome (bonus) | no |
| ordina | query | stringa: dataOra, nome, postiLiberi (bonus) | no |
| direzione | query | asc / desc (bonus) | no |

**Risposta 200**
[ { "id": 3, "nome": "Torneo d'autunno", "gioco": "Calcio virtuale", "categoria": "Calcio",
    "modalita": "singolo", "giocatoriPerSquadra": 1, "stato": "aperto", "inCorso": false,
    "dataOra": "2026-10-16T15:00:00", "dataFine": "2026-10-17T19:00:00",
    "postiMax": 16, "iscritti": 7, "foto": "img/calcio.jpg" } ]

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | valore di stato, inCorso, ordina o direzione non valido | {"errore": "Parametro non valido"} |
| 404 | categoria inesistente | {"errore": "Categoria non trovata"} |

## GET /api/tornei/top
I 3 tornei con più iscritti. Accesso: pubblico.

**Risposta 200** come l'elenco dei tornei (3 elementi, ordinati per iscritti).

## GET /api/tornei/live
Tornei in corso adesso: stato "chiuso" e ora attuale tra dataOra e dataFine, cioè `inCorso` true (come GET /api/tornei?inCorso=true). Accesso: pubblico.

**Risposta 200** come l'elenco dei tornei (array vuoto se nessun torneo è in corso).

## GET /api/tornei/{id}
Dettaglio di un torneo. Accesso: pubblico. Con la sessione aperta `miaSquadra` indica la squadra dell'utente e se ne è il capitano (null se non iscritto o visitatore). Il pulsante "Annulla iscrizione" si mostra solo se `sonoCapitano` è true.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| id | path | intero | sì |

**Risposta 200**
{ "id": 5, "nome": "Sfida di Natale", "descrizione": "Squadre da 3, gironi all'italiana.",
  "gioco": "Calcio virtuale", "categoria": "Calcio", "modalita": "squadra", "giocatoriPerSquadra": 3,
  "stato": "chiuso", "inCorso": true, "dataOra": "2026-10-12T10:00:00", "dataFine": "2026-10-12T20:00:00",
  "postiMax": 4, "iscritti": 3, "foto": "img/calcio.jpg",
  "miaSquadra": { "id": 51, "nome": "Team Alfa", "sonoCapitano": true } }

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | id non numerico | {"errore": "Parametro non valido"} |
| 404 | id inesistente | {"errore": "Torneo non trovato"} |

## POST /api/tornei
Creazione di un torneo, stato iniziale "aperto". Accesso: admin.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| nome | body | stringa | sì |
| descrizione | body | stringa | no |
| gioco | body | stringa | sì |
| categoria | body | stringa (una di /api/categorie) | sì |
| modalita | body | singolo, duo, squadra | sì |
| giocatoriPerSquadra | body | intero (1 singolo, 2 duo, almeno 3 squadra) | sì |
| dataOra | body | data ISO 8601 | sì |
| dataFine | body | data ISO 8601, non prima di dataOra | sì |
| postiMax | body | intero > 0 (squadre; nel singolo giocatori) | sì |
| foto | body | stringa, percorso immagine | no |

**Risposta 201**
{ "id": 7, "nome": "Coppa Primavera", "gioco": "Calcio virtuale", "categoria": "Calcio",
  "modalita": "squadra", "giocatoriPerSquadra": 5, "stato": "aperto",
  "dataOra": "2026-11-07T15:00:00", "dataFine": "2026-11-08T19:00:00", "postiMax": 16, "iscritti": 0 }

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | campi mancanti o non validi (anche dataFine prima di dataOra, modalità incoerente con giocatoriPerSquadra) | {"errore": "Dati non validi"} |
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |
| 403 | ruolo non admin | {"errore": "Operazione non consentita"} |

## PUT /api/tornei/{id}
Modifica di un torneo. Accesso: admin.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| id | path | intero | sì |
| nome | body | stringa | sì |
| descrizione | body | stringa | no |
| gioco | body | stringa | sì |
| categoria | body | stringa (una di /api/categorie) | sì |
| modalita | body | singolo, duo, squadra | sì |
| giocatoriPerSquadra | body | intero (1 singolo, 2 duo, almeno 3 squadra) | sì |
| dataOra | body | data ISO 8601 | sì |
| dataFine | body | data ISO 8601, non prima di dataOra | sì |
| postiMax | body | intero > 0 (squadre; nel singolo giocatori) | sì |
| foto | body | stringa, percorso immagine | no |

**Risposta 200** come il dettaglio del torneo.

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | campi mancanti o non validi | {"errore": "Dati non validi"} |
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |
| 403 | ruolo non admin | {"errore": "Operazione non consentita"} |
| 404 | id inesistente | {"errore": "Torneo non trovato"} |
| 422 | torneo concluso | {"errore": "Un torneo concluso non è modificabile"} |
| 422 | postiMax minore delle squadre iscritte | {"errore": "Posti inferiori alle squadre iscritte"} |
| 422 | modalità cambiata con iscritti presenti | {"errore": "Modalità non modificabile con iscrizioni presenti"} |

## PATCH /api/tornei/{id}/stato
Cambio di stato. Transizioni ammesse: aperto -> chiuso -> concluso. Per chiudere servono almeno 2 squadre, per concludere tutte le partite devono essere concluse. Accesso: admin.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| id | path | intero | sì |
| stato | body | stringa (chiuso, concluso) | sì |

**Risposta 200**
{ "id": 3, "stato": "chiuso" }

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | stato non valido | {"errore": "Dati non validi"} |
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |
| 403 | ruolo non admin | {"errore": "Operazione non consentita"} |
| 404 | id inesistente | {"errore": "Torneo non trovato"} |
| 422 | transizione non ammessa | {"errore": "Cambio di stato non consentito"} |
| 422 | partite non concluse | {"errore": "Ci sono partite non concluse"} |
| 422 | meno di 2 squadre | {"errore": "Servono almeno 2 squadre iscritte per chiudere il torneo"} |

---

## GET /api/tornei/{id}/squadre
Squadre iscritte a un torneo con i componenti (nei tornei singoli ogni squadra ha 1 componente). Accesso: pubblico.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| id | path | intero | sì |

**Risposta 200**
[ { "id": 51, "nome": "Team Alfa", "capitanoId": 12, "componenti": [
    { "utenteId": 12, "nome": "Mario", "cognome": "Rossi" },
    { "utenteId": 13, "nome": "Luca", "cognome": "Verdi" } ] } ]

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 404 | id inesistente | {"errore": "Torneo non trovato"} |

## POST /api/tornei/{id}/iscrizioni
Iscrive l'utente autenticato al torneo. Accesso: utente.
Torneo singolo: nessun body, la squadra da 1 giocatore si crea in automatico.
Torneo duo o squadra: l'utente crea la squadra e ne diventa il capitano; indica nome e email degli altri componenti (utenti già registrati, controllabili con GET /api/utenti/cerca), che vengono iscritti con lui.
Limite di tornei attivi: l'iscrizione è rifiutata se l'utente, o uno dei componenti indicati, ha già raggiunto `maxTorneiAttivi` tornei attivi (aperti o chiusi).

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| id | path | intero | sì |
| squadraNome | body | stringa, unica nel torneo | solo duo e squadra |
| componenti | body | array di email degli altri componenti (giocatoriPerSquadra - 1) | solo duo e squadra |

**Risposta 201**
{ "torneoId": 4, "data": "2026-10-12T15:40:00",
  "squadra": { "id": 46, "nome": "Duo Alfa", "capitanoId": 12, "componenti": [
    { "utenteId": 12, "nome": "Mario", "cognome": "Rossi" },
    { "utenteId": 16, "nome": "Elena", "cognome": "Conti" } ] } }

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | nome squadra mancante o componenti non del numero richiesto | {"errore": "La squadra deve avere 2 componenti"} |
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |
| 404 | torneo inesistente | {"errore": "Torneo non trovato"} |
| 409 | utente già iscritto | {"errore": "Sei già iscritto a questo torneo"} |
| 409 | un componente è già iscritto | {"errore": "Luca Verdi è già iscritto a questo torneo"} |
| 409 | nome squadra già usato nel torneo | {"errore": "Nome squadra già usato in questo torneo"} |
| 422 | email di un componente non registrata | {"errore": "luigi.bruni@mail.it non è registrato: deve prima creare un account"} |
| 422 | torneo chiuso o pieno | {"errore": "Torneo chiuso o senza posti liberi"} |
| 422 | l'utente ha raggiunto il limite di tornei attivi | {"errore": "Hai già raggiunto il limite di 3 tornei attivi"} |
| 422 | un componente ha raggiunto il limite | {"errore": "Elena Conti ha già raggiunto il limite di 3 tornei attivi"} |

## DELETE /api/tornei/{id}/iscrizioni
Annulla l'iscrizione dell'utente autenticato. Possibile solo con torneo aperto. Nei tornei duo e squadra la può annullare solo il capitano: la squadra viene sciolta. Accesso: utente.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| id | path | intero | sì |

**Risposta 204** (nessun contenuto)

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |
| 403 | l'utente non è il capitano della squadra | {"errore": "Solo il capitano può annullare l'iscrizione della squadra"} |
| 404 | torneo o iscrizione inesistente | {"errore": "Iscrizione non trovata"} |
| 422 | torneo non aperto | {"errore": "Il torneo non è più aperto"} |

---

## GET /api/utenti/me/tornei
"I miei tornei": tornei a cui l'utente loggato partecipa (come capitano o componente), ordinati per dataOra decrescente. Ogni elemento ha i campi del dettaglio del torneo (compresi dataFine e foto, usati dalla card) più `squadra`, `dataIscrizione` e i punti: `punti` (i punti dell'utente nel torneo) e `posizione` (posizione della sua squadra nella classifica del torneo), entrambi null se il torneo non ha ancora partite concluse. Il pulsante "Annulla iscrizione" si mostra solo con torneo aperto e `sonoCapitano` true. Accesso: utente.

**Risposta 200**
[ { "id": 5, "nome": "Sfida di Natale", "gioco": "Calcio virtuale", "categoria": "Calcio",
    "modalita": "squadra", "giocatoriPerSquadra": 3, "stato": "chiuso", "inCorso": true,
    "dataOra": "2026-10-12T10:00:00", "dataFine": "2026-10-12T20:00:00",
    "postiMax": 4, "iscritti": 3, "foto": "img/calcio.jpg",
    "squadra": { "id": 51, "nome": "Team Alfa", "sonoCapitano": true },
    "dataIscrizione": "2026-10-08T10:00:00", "punti": 3, "posizione": 1 } ]

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |

## GET /api/utenti/cerca
Cerca un utente registrato per email esatta. Serve alla pagina di iscrizione a un torneo duo o squadra, per controllare ogni componente mentre si scrive la sua email. Restituisce nome e cognome e `puoIscriversi`: false se l'utente ha già raggiunto il limite di tornei attivi (il frontend mostra ✗ accanto al componente). Accesso: utente.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| email | query | stringa, email esatta | sì |

**Risposta 200**
{ "utenteId": 13, "nome": "Luca", "cognome": "Verdi", "puoIscriversi": true }

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | email mancante | {"errore": "Parametro non valido"} |
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |
| 404 | nessun utente con quell'email | {"errore": "Utente non registrato"} |

## GET /api/utenti/me/statistiche
Pagina profilo, riepilogo: punti totali, posizione nella classifica generale, numero di tornei e partite, tornei attivi e limite massimo, punti e posizione per ogni categoria. `torniAttivi` conta i tornei aperti o chiusi a cui l'utente è iscritto; `maxTorneiAttivi` è il limite deciso dall'admin (il frontend disattiva "Iscriviti" quando `torniAttivi` è uguale o maggiore). I punti sono quelli delle sole partite concluse (individuali se inseriti, altrimenti della squadra). `posizione` è null se l'utente non ha ancora partite concluse. Accesso: utente.

**Risposta 200**
{ "punti": 13, "posizione": 2, "tornei": 3, "torniAttivi": 2, "maxTorneiAttivi": 3,
  "partiteGiocate": 2, "partiteDaGiocare": 1,
  "perCategoria": [ { "categoria": "Calcio", "punti": 3, "posizione": 1 },
                    { "categoria": "Sparatutto", "punti": 10, "posizione": 2 } ] }

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |

## GET /api/utenti/me/partite
Pagina profilo, "Le mie partite": le partite delle squadre dell'utente, ordinate per data decrescente, con i punti dell'utente (null se la partita non ha ancora i punti). Accesso: utente.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| torneoId | query | intero, solo le partite di quel torneo | no |
| stato | query | programmata o conclusa | no |

**Risposta 200**
[ { "id": 31, "torneoId": 5, "torneo": "Sfida di Natale", "turno": "Girone 1",
    "dataOra": "2026-10-12T10:00:00", "stato": "conclusa", "miaSquadraId": 51, "mieiPunti": 3,
    "squadre": [ { "squadraId": 51, "nome": "Team Alfa", "punti": 4 },
                 { "squadraId": 52, "nome": "Team Beta", "punti": 0 } ] } ]

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | torneoId o stato non validi | {"errore": "Parametro non valido"} |
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |
| 404 | torneoId inesistente | {"errore": "Torneo non trovato"} |

## PUT /api/utenti/me
Pagina profilo, "Modifica profilo". Accesso: utente.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| nome | body | stringa | sì |
| cognome | body | stringa | sì |
| email | body | stringa | sì |

**Risposta 200**
{ "id": 12, "nome": "Mario", "cognome": "Rossi", "email": "mario.rossi@mail.it", "ruolo": "utente" }

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | campi mancanti o email non valida | {"errore": "Dati non validi"} |
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |
| 409 | email già usata da un altro utente | {"errore": "Email già in uso"} |

## PUT /api/utenti/me/password
Pagina profilo, "Cambia password". Accesso: utente.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| passwordAttuale | body | stringa | sì |
| passwordNuova | body | stringa | sì |

**Risposta 204** (nessun contenuto)

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | campi mancanti | {"errore": "Dati non validi"} |
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |
| 422 | password attuale errata | {"errore": "Password attuale errata"} |

## GET /api/tornei/{id}/iscritti
Elenco delle squadre iscritte con email dei componenti e data di iscrizione (quella del capitano). Accesso: admin.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| id | path | intero | sì |

**Risposta 200**
[ { "squadraId": 51, "squadra": "Team Alfa", "capitanoId": 12, "data": "2026-10-08T10:00:00", "componenti": [
    { "utenteId": 12, "nome": "Mario", "cognome": "Rossi", "email": "mario@mail.it" },
    { "utenteId": 13, "nome": "Luca", "cognome": "Verdi", "email": "luca@mail.it" } ] } ]

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |
| 403 | ruolo non admin | {"errore": "Operazione non consentita"} |
| 404 | id inesistente | {"errore": "Torneo non trovato"} |

---

## GET /api/tornei/{id}/partite
Partite di un torneo, ordinate per data. I punti sono null finché non vengono inseriti. Accesso: pubblico.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| id | path | intero | sì |

**Risposta 200**
[ { "id": 31, "torneoId": 5, "turno": "Girone 1", "dataOra": "2026-10-12T10:00:00", "stato": "conclusa",
    "squadre": [ { "squadraId": 51, "nome": "Team Alfa", "punti": 4 },
                 { "squadraId": 52, "nome": "Team Beta", "punti": 0 } ] } ]

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 404 | id inesistente | {"errore": "Torneo non trovato"} |

## POST /api/tornei/{id}/partite
Creazione di una partita tra 2 o più squadre del torneo, stato iniziale "programmata". Il torneo deve essere chiuso. Accesso: admin.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| id | path | intero | sì |
| turno | body | stringa (es. "Girone 1", "Finale") | no |
| dataOra | body | data ISO 8601 | no |
| squadre | body | array di id squadra, almeno 2 | sì |

**Risposta 201**
{ "id": 34, "torneoId": 5, "turno": "Finale", "dataOra": "2026-10-12T18:00:00", "stato": "programmata",
  "squadre": [ { "squadraId": 51, "nome": "Team Alfa", "punti": null },
               { "squadraId": 53, "nome": "Team Gamma", "punti": null } ] }

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | meno di 2 squadre o squadra ripetuta | {"errore": "Una partita richiede almeno 2 squadre"} |
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |
| 403 | ruolo non admin | {"errore": "Operazione non consentita"} |
| 404 | id inesistente | {"errore": "Torneo non trovato"} |
| 422 | squadra non iscritta al torneo | {"errore": "La squadra 61 non è iscritta a questo torneo"} |
| 422 | torneo non chiuso | {"errore": "Le partite si creano a torneo chiuso"} |

## GET /api/partite/{id}
Dettaglio di una partita con i giocatori di ogni squadra e i loro punti individuali (null se non inseriti). Accesso: pubblico.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| id | path | intero | sì |

**Risposta 200**
{ "id": 33, "torneoId": 5, "torneo": "Sfida di Natale", "turno": "Girone 3",
  "dataOra": "2026-10-12T16:00:00", "stato": "programmata",
  "squadre": [ { "squadraId": 51, "nome": "Team Alfa", "punti": null, "giocatori": [
      { "utenteId": 12, "nome": "Mario", "cognome": "Rossi", "punti": null } ] } ] }

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | id non numerico | {"errore": "Parametro non valido"} |
| 404 | id inesistente | {"errore": "Partita non trovata"} |

## PUT /api/partite/{id}/punti
Inserisce o corregge i punti di una partita. Punti di squadra obbligatori per tutte le squadre; punti dei giocatori facoltativi, ma per ogni squadra o per tutti i componenti o per nessuno. Se `giocatori` manca per una squadra, i suoi eventuali punti individuali già salvati vengono cancellati. Con concludi=true la partita diventa "conclusa" e conta nelle classifiche. Accesso: admin.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| id | path | intero | sì |
| concludi | body | booleano (default false) | no |
| squadre | body | array di { squadraId, punti >= 0, giocatori } | sì |
| giocatori | body | dentro squadre: array di { utenteId, punti >= 0 } | no |

**Risposta 200** come il dettaglio della partita, con i punti salvati.
{ "id": 33, "torneoId": 5, "torneo": "Sfida di Natale", "stato": "conclusa", "squadre": [ { "squadraId": 51, "nome": "Team Alfa", "punti": 3, "giocatori": [
    { "utenteId": 12, "nome": "Mario", "cognome": "Rossi", "punti": 2 } ] } ] }

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | punti negativi | {"errore": "Dati non validi: i punti non possono essere negativi"} |
| 400 | mancano i punti di una squadra | {"errore": "Indicare i punti di tutte le squadre della partita"} |
| 400 | squadra che non gioca la partita | {"errore": "La squadra 52 non gioca questa partita"} |
| 400 | punti giocatori incompleti | {"errore": "Indicare i punti di tutti i componenti della squadra o di nessuno"} |
| 400 | giocatore non della squadra | {"errore": "Il giocatore 15 non fa parte della squadra 51"} |
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |
| 403 | ruolo non admin | {"errore": "Operazione non consentita"} |
| 404 | id inesistente | {"errore": "Partita non trovata"} |
| 422 | torneo concluso | {"errore": "Il torneo è concluso: i punti non sono più modificabili"} |

## GET /api/giocate
Elenco delle top giocate, dalla più recente. Serve alla pagina "Top giocate" del menu (tutti i tornei) e alla scheda "Top giocate" del dettaglio torneo (con `torneoId`). Il frontend incorpora il video con `https://www.youtube.com/embed/{youtubeId}?start={inizioSec}&end={fineSec}`. Accesso: pubblico.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| torneoId | query | intero | no |
| categoria | query | stringa | no |

**Risposta 200**
[ { "id": 8, "torneoId": 5, "torneo": "Sfida di Natale", "titolo": "Gol al volo",
    "youtubeId": "Xk3fPq9LmZ8", "inizioSec": 90, "fineSec": 135,
    "partitaId": 31, "turno": "Girone 1", "utenteId": 12, "giocatore": "Mario Rossi" } ]
`partitaId`, `turno`, `utenteId` e `giocatore` sono null se la clip non è collegata a una partita o a un giocatore. Array vuoto se non ci sono clip.

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | torneoId non numerico | {"errore": "Parametro non valido"} |
| 404 | torneo inesistente | {"errore": "Torneo non trovato"} |
| 404 | categoria inesistente | {"errore": "Categoria non trovata"} |

## POST /api/tornei/{id}/giocate
Aggiunge una top giocata a un torneo (anche aperto o concluso). L'admin incolla il link YouTube e il frontend ne ricava l'ID; i tempi si inseriscono come min:sec e si inviano in secondi. Accesso: admin.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| id | path | intero | sì |
| titolo | body | stringa, massimo 100 caratteri | sì |
| youtubeId | body | stringa, ID del video (non il link intero) | sì |
| inizioSec | body | intero >= 0 | sì |
| fineSec | body | intero, maggiore di inizioSec | sì |
| partitaId | body | intero, partita dello stesso torneo | no |
| utenteId | body | intero, giocatore registrato | no |

**Risposta 201**
{ "id": 8, "torneoId": 5, "torneo": "Sfida di Natale", "titolo": "Gol al volo",
  "youtubeId": "Xk3fPq9LmZ8", "inizioSec": 90, "fineSec": 135,
  "partitaId": 31, "turno": "Girone 1", "utenteId": 12, "giocatore": "Mario Rossi" }

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | campi mancanti o non validi | {"errore": "Dati non validi"} |
| 400 | fine non dopo l'inizio | {"errore": "La fine deve essere dopo l'inizio"} |
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |
| 403 | ruolo non admin | {"errore": "Operazione non consentita"} |
| 404 | id torneo inesistente | {"errore": "Torneo non trovato"} |
| 422 | partita di un altro torneo | {"errore": "La partita 40 non appartiene a questo torneo"} |
| 422 | giocatore non registrato | {"errore": "Il giocatore 99 non esiste"} |

## DELETE /api/giocate/{id}
Elimina una top giocata. Accesso: admin.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| id | path | intero | sì |

**Risposta 204** (nessun contenuto)

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | id non numerico | {"errore": "Parametro non valido"} |
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |
| 403 | ruolo non admin | {"errore": "Operazione non consentita"} |
| 404 | id inesistente | {"errore": "Giocata non trovata"} |

---

## GET /api/tornei/{id}/classifica
Classifica delle squadre di un torneo (nei singoli, dei giocatori): somma dei punti delle partite concluse. Accesso: pubblico.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| id | path | intero | sì |

**Risposta 200**
[ { "posizione": 1, "squadraId": 51, "squadra": "Team Alfa", "punti": 4, "partiteGiocate": 1 } ]

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 404 | id inesistente | {"errore": "Torneo non trovato"} |

## GET /api/tornei/{id}/classifica-giocatori
Classifica dei giocatori di un torneo. Il punteggio di un giocatore in una partita è quello individuale se inserito, altrimenti quello della sua squadra. Accesso: pubblico.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| id | path | intero | sì |

**Risposta 200**
[ { "posizione": 1, "utenteId": 12, "giocatore": "Mario Rossi", "squadra": "Team Alfa", "punti": 3 } ]

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 404 | id inesistente | {"errore": "Torneo non trovato"} |

## GET /api/classifica
Classifica generale: somma dei punti di ogni giocatore in tutti i tornei. Accesso: pubblico.

**Risposta 200**
[ { "posizione": 1, "utenteId": 17, "giocatore": "Giulia Bianchi", "punti": 16 } ]

## GET /api/classifica/top
I primi 3 della classifica generale. Accesso: pubblico.

**Risposta 200** come la classifica generale (3 elementi).

## GET /api/classifica/categorie/{categoria}
Somma dei punti nei soli tornei della categoria. Accesso: pubblico.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| categoria | path | stringa (es. calcio, sparatutto) | sì |

**Risposta 200** come la classifica generale.

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 404 | categoria inesistente | {"errore": "Categoria non trovata"} |

