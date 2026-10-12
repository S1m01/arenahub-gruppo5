# ArenaHub - Contratto API v1

Convenzioni comuni:
- Nomi dei campi in camelCase
- Elenchi restituiti come array JSON
- Errori sempre nella forma {"errore": "..."}
- Autenticazione: sessione aperta dal login (cookie di sessione)
- Mappatura tra colonne del DB e campi JSON concordata con il DB admin

## Indice degli endpoint

| Metodo | Path | Descrizione | Accesso |
|--------|------|-------------|---------|
| POST | /api/auth/registrazione | Registrazione nuovo utente | pubblico |
| POST | /api/auth/login | Login, apre la sessione | pubblico |
| POST | /api/auth/logout | Logout, chiude la sessione | utente |
| GET | /api/auth/me | Dati dell'utente loggato | utente |
| GET | /api/tornei | Elenco dei tornei, filtri opzionali | pubblico |
| GET | /api/tornei/{id} | Dettaglio di un torneo | pubblico |
| POST | /api/tornei | Creazione di un torneo | admin |
| PUT | /api/tornei/{id} | Modifica di un torneo | admin |
| PATCH | /api/tornei/{id}/stato | Cambio di stato (chiusura, conclusione) | admin |
| POST | /api/tornei/{id}/iscrizioni | Iscrizione dell'utente loggato | utente |
| DELETE | /api/tornei/{id}/iscrizioni | Annullamento dell'iscrizione | utente |
| GET | /api/utenti/me/tornei | "I miei tornei" | utente |
| GET | /api/tornei/{id}/iscritti | Elenco iscritti di un torneo | admin |

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
{ "id": 12,
 "nome": "Mario",
  "cognome": "Rossi",
   "email": "mario@mail.it",
    "ruolo": "utente" }

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
Dati dell'utente loggato (serve all'header: nome utente e "Esci"). Accesso: utente.

**Risposta 200**
{ "id": 12, "nome": "Mario", "cognome": "Rossi", "ruolo": "utente" }

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |

---

## GET /api/tornei
Elenco dei tornei con i posti occupati. Accesso: pubblico.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| stato | query | stringa (aperto, chiuso, concluso) | no |
| gioco | query | stringa (bonus) | no |
| cerca | query | stringa, ricerca per nome (bonus) | no |
| ordina | query | stringa: dataOra, nome, postiLiberi (bonus) | no |
| direzione | query | asc / desc (bonus) | no |

**Risposta 200**
[ { "id": 3, "nome": "Torneo d'autunno", "gioco": "Calcio virtuale", "stato": "aperto",
    "dataOra": "2026-10-16T15:00:00", "postiMax": 16, "iscritti": 7 } ]

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | valore di stato o ordina non valido | {"errore": "Parametro non valido"} |

## GET /api/tornei/{id}
Dettaglio di un torneo. Accesso: pubblico.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| id | path | intero | sì |

**Risposta 200**
{ "id": 3, "nome": "Torneo d'autunno", "descrizione": "Torneo di calcio virtuale...",
  "gioco": "Calcio virtuale", "stato": "aperto", "dataOra": "2026-10-16T15:00:00",
  "postiMax": 16, "iscritti": 7 }

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 404 | id inesistente | {"errore": "Torneo non trovato"} |

## POST /api/tornei
Creazione di un torneo, stato iniziale "aperto". Accesso: admin.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| nome | body | stringa | sì |
| descrizione | body | stringa | no |
| gioco | body | stringa | sì |
| dataOra | body | data ISO 8601 | sì |
| postiMax | body | intero > 0 | sì |

**Risposta 201**
{ "id": 7, "nome": "Coppa ITS", "descrizione": "...", "gioco": "Picchiaduro", "stato": "aperto",
  "dataOra": "2026-10-21T14:30:00", "postiMax": 8, "iscritti": 0 }

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | campi mancanti o non validi | {"errore": "Dati non validi"} |
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
| dataOra | body | data ISO 8601 | sì |
| postiMax | body | intero > 0 | sì |

**Risposta 200** come il dettaglio del torneo.

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 400 | campi mancanti o non validi | {"errore": "Dati non validi"} |
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |
| 403 | ruolo non admin | {"errore": "Operazione non consentita"} |
| 404 | id inesistente | {"errore": "Torneo non trovato"} |
| 422 | postiMax minore degli iscritti attuali | {"errore": "Posti inferiori agli iscritti"} |

## PATCH /api/tornei/{id}/stato
Cambio di stato. Transizioni ammesse: aperto -> chiuso -> concluso. Accesso: admin.

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

---

## POST /api/tornei/{id}/iscrizioni
Iscrive l'utente autenticato al torneo. Accesso: utente.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| id | path | intero | sì |

**Risposta 201**
{ "id": 87, "torneoId": 3, "utenteId": 12, "data": "2026-10-14T10:30:00" }

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |
| 404 | torneo inesistente | {"errore": "Torneo non trovato"} |
| 409 | utente già iscritto | {"errore": "Sei già iscritto a questo torneo"} |
| 422 | torneo chiuso o pieno | {"errore": "Torneo chiuso o senza posti liberi"} |

## DELETE /api/tornei/{id}/iscrizioni
Annulla l'iscrizione dell'utente autenticato. Possibile solo con torneo aperto. Accesso: utente.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|
| id | path | intero | sì |

**Risposta 204** (nessun contenuto)

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |
| 404 | torneo o iscrizione inesistente | {"errore": "Iscrizione non trovata"} |
| 422 | torneo non aperto | {"errore": "Il torneo non è più aperto"} |

---

## GET /api/utenti/me/tornei
"I miei tornei": tornei a cui l'utente loggato è iscritto. Accesso: utente.

**Risposta 200**
[ { "id": 3, "nome": "Torneo d'autunno", "gioco": "Calcio virtuale", "stato": "aperto",
    "dataOra": "2026-10-16T15:00:00", "dataIscrizione": "2026-10-14T10:30:00" } ]

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |

## GET /api/tornei/{id}/iscritti
Elenco degli iscritti a un torneo. Accesso: admin.

| Parametro | Dove | Tipo | Obbligatorio |
|-----------|------|------|--------------|d
| id | path | intero | sì |

**Risposta 200**
[ { "iscrizioneId": 87, "utenteId": 12, "nome": "Mario", "cognome": "Rossi",
    "email": "mario@mail.it", "data": "2026-10-14T10:30:00" } ]

**Errori**
| Codice | Causa | Risposta |
|--------|-------|----------|
| 401 | utente non autenticato | {"errore": "Utente non autenticato"} |
| 403 | ruolo non admin | {"errore": "Operazione non consentita"} |
| 404 | id inesistente | {"errore": "Torneo non trovato"} |