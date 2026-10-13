CREATE TABLE utente (
  id_utente INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  cognome VARCHAR(50) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  ruolo VARCHAR(10) NOT NULL DEFAULT 'utente' CHECK (ruolo IN ('utente', 'admin'))
);

CREATE TABLE categoria (
  id_categoria INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(40) NOT NULL UNIQUE            
);

CREATE TABLE torneo (
  id_torneo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descrizione TEXT,
  gioco VARCHAR(80) NOT NULL,
  id_categoria INT NOT NULL,
  modalita VARCHAR(10) NOT NULL DEFAULT 'singolo' CHECK (modalita IN ('singolo', 'duo', 'squadra')),
  giocatori_per_squadra SMALLINT NOT NULL DEFAULT 1,
  data_inizio TIMESTAMP NOT NULL,
  data_fine TIMESTAMP NOT NULL,
  posti_max INT NOT NULL CHECK (posti_max > 0), 
  stato VARCHAR(10) NOT NULL DEFAULT 'aperto' CHECK (stato IN ('aperto', 'chiuso', 'concluso')),
  foto VARCHAR(255),
  FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
  CHECK ((modalita = 'singolo' AND giocatori_per_squadra = 1)
      OR (modalita = 'duo' AND giocatori_per_squadra = 2)
      OR (modalita = 'squadra' AND giocatori_per_squadra >= 3))
);

CREATE TABLE squadra (
  id_squadra INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_torneo INT NOT NULL,
  nome VARCHAR(60) NOT NULL,
  id_capitano INT NOT NULL,
  UNIQUE (id_torneo, nome),                     
  UNIQUE (id_squadra, id_torneo),               
  FOREIGN KEY (id_torneo) REFERENCES torneo(id_torneo),
  FOREIGN KEY (id_capitano) REFERENCES utente(id_utente)
);

CREATE TABLE iscrizione (
  id_iscrizione INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_torneo INT NOT NULL,
  id_utente INT NOT NULL,
  id_squadra INT NOT NULL,
  data TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (id_torneo, id_utente),               
  UNIQUE (id_utente, id_squadra),         
  FOREIGN KEY (id_torneo) REFERENCES torneo(id_torneo),
  FOREIGN KEY (id_utente) REFERENCES utente(id_utente),
  FOREIGN KEY (id_squadra, id_torneo) REFERENCES squadra(id_squadra, id_torneo) 
);

CREATE TABLE partita (
  id_partita INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_torneo INT NOT NULL,
  turno VARCHAR(40),
  data_ora TIMESTAMP,
  stato VARCHAR(12) NOT NULL DEFAULT 'programmata' CHECK (stato IN ('programmata', 'conclusa')),
  UNIQUE (id_partita, id_torneo),
  FOREIGN KEY (id_torneo) REFERENCES torneo(id_torneo)
);

CREATE TABLE partita_squadra (
  id_partita INT NOT NULL,
  id_squadra INT NOT NULL,
  id_torneo INT NOT NULL,
  punti INT CHECK (punti >= 0),                  
  PRIMARY KEY (id_partita, id_squadra),
  FOREIGN KEY (id_partita, id_torneo) REFERENCES partita(id_partita, id_torneo),
  FOREIGN KEY (id_squadra, id_torneo) REFERENCES squadra(id_squadra, id_torneo)  
);

CREATE TABLE punti_giocatore (
  id_partita INT NOT NULL,
  id_utente INT NOT NULL,
  id_squadra INT NOT NULL,
  punti INT NOT NULL DEFAULT 0 CHECK (punti >= 0),
  PRIMARY KEY (id_partita, id_utente),
  FOREIGN KEY (id_partita, id_squadra) REFERENCES partita_squadra(id_partita, id_squadra),
  FOREIGN KEY (id_utente, id_squadra) REFERENCES iscrizione(id_utente, id_squadra)
);

CREATE TABLE giocata (
  id_giocata INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_torneo INT NOT NULL,
  id_partita INT NULL,
  id_utente INT NULL,
  titolo VARCHAR(100) NOT NULL,
  id_youtube VARCHAR(50) NOT NULL,              
  inizio_sec INT NOT NULL DEFAULT 0 CHECK (inizio_sec >= 0),
  fine_sec INT NOT NULL,
  CHECK (fine_sec > inizio_sec),
  FOREIGN KEY (id_torneo) REFERENCES torneo(id_torneo),
  FOREIGN KEY (id_partita, id_torneo) REFERENCES partita(id_partita, id_torneo),   
  FOREIGN KEY (id_utente) REFERENCES utente(id_utente)
);

CREATE VIEW classifica_torneo AS
SELECT s.id_torneo, s.id_squadra, s.nome AS squadra,
       COALESCE(SUM(CASE WHEN p.id_partita IS NOT NULL THEN ps.punti ELSE 0 END), 0) AS punti,
       COUNT(p.id_partita) AS partite_giocate
FROM squadra s
LEFT JOIN partita_squadra ps ON ps.id_squadra = s.id_squadra
LEFT JOIN partita p ON p.id_partita = ps.id_partita AND p.stato = 'conclusa'
GROUP BY s.id_torneo, s.id_squadra, s.nome;

CREATE VIEW classifica_giocatori_torneo AS
SELECT p.id_torneo, u.id_utente, CONCAT(u.nome, ' ', u.cognome) AS giocatore,
       sq.nome AS squadra, SUM(COALESCE(pg.punti, ps.punti)) AS punti
FROM iscrizione i
JOIN squadra sq ON sq.id_squadra = i.id_squadra
JOIN partita_squadra ps ON ps.id_squadra = i.id_squadra
JOIN partita p ON p.id_partita = ps.id_partita AND p.stato = 'conclusa'
LEFT JOIN punti_giocatore pg ON pg.id_partita = ps.id_partita AND pg.id_utente = i.id_utente
JOIN utente u ON u.id_utente = i.id_utente
GROUP BY p.id_torneo, u.id_utente, u.nome, u.cognome, sq.nome;

CREATE VIEW classifica_generale AS
SELECT u.id_utente, CONCAT(u.nome, ' ', u.cognome) AS giocatore,
       SUM(COALESCE(pg.punti, ps.punti)) AS punti
FROM iscrizione i
JOIN partita_squadra ps ON ps.id_squadra = i.id_squadra
JOIN partita p ON p.id_partita = ps.id_partita AND p.stato = 'conclusa'
LEFT JOIN punti_giocatore pg ON pg.id_partita = ps.id_partita AND pg.id_utente = i.id_utente
JOIN utente u ON u.id_utente = i.id_utente
GROUP BY u.id_utente, u.nome, u.cognome;

CREATE VIEW classifica_categoria AS
SELECT t.id_categoria, u.id_utente, CONCAT(u.nome, ' ', u.cognome) AS giocatore,
       SUM(COALESCE(pg.punti, ps.punti)) AS punti
FROM iscrizione i
JOIN partita_squadra ps ON ps.id_squadra = i.id_squadra
JOIN partita p ON p.id_partita = ps.id_partita AND p.stato = 'conclusa'
LEFT JOIN punti_giocatore pg ON pg.id_partita = ps.id_partita AND pg.id_utente = i.id_utente
JOIN torneo t ON t.id_torneo = p.id_torneo
JOIN utente u ON u.id_utente = i.id_utente
GROUP BY t.id_categoria, u.id_utente, u.nome, u.cognome;

CREATE VIEW partita_giocatore AS
SELECT i.id_utente, p.id_partita, p.id_torneo, i.id_squadra, p.stato, p.data_ora,
       COALESCE(pg.punti, ps.punti) AS punti
FROM iscrizione i
JOIN partita_squadra ps ON ps.id_squadra = i.id_squadra
JOIN partita p ON p.id_partita = ps.id_partita
LEFT JOIN punti_giocatore pg ON pg.id_partita = ps.id_partita AND pg.id_utente = i.id_utente;

