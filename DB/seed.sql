INSERT INTO utente (id_utente, nome, cognome, email, password_hash, ruolo) OVERRIDING SYSTEM VALUE VALUES
(1,  'Admin',     'ITS',      'admin@its.it',      '$2a$10$iK2nsWBuqxN7tN6QZLuZw.JZG1dAGmkJ4QhzLQ1EozD68pxnKKefO', 'admin'),
(2,  'Simone',    'Admin',    'simone@its.it',     '$2a$10$26yX8XrHsh7I74sER48W3O4fBU81xhlynDUJkswcCRhu5EkkfsC/m', 'admin'),
(3,  'Mario',     'Rossi',    'mario@mail.it',     '$2a$10$1OZyWuSPbYkvjSBKKtlsAOJUIaL2uVoomb1ViYup306YIMFlK6dCy', 'utente'),
(4,  'Luca',      'Verdi',    'luca@mail.it',      '$2a$10$GGxdyXcUAroAClQSaVFJOuXa/vkw2WxNKna.Ly/T5aLc5huQ/CWhm', 'utente'),
(5,  'Sara',      'Neri',     'sara@mail.it',      '$2a$10$W2p64n41XvKYYXY2WTP8de8fFLu7J8kN4Ry2cUJWTgfH6mq1dAA8G', 'utente'),
(6,  'Paolo',     'Gallo',    'paolo@mail.it',     '$2a$10$2bn8nOP//mcnf0Xc.7B1te.udkRubEXrtQ3XtZJnuHUrFVUzlgXXm', 'utente'),
(7,  'Elena',     'Conti',    'elena@mail.it',     '$2a$10$6D4WJJRCOMLoNxnkAYvSgew8zO7rJYTnnPmW/qIPZqNlRlXwtsjjy', 'utente'),
(8,  'Giulia',    'Bianchi',  'giulia@mail.it',    '$2a$10$NTvM9TAQYyVhw2WlJriI1OfNRpl5p05OHfzeAm6eYFW4G1/eYq8GS', 'utente'),
(9,  'Marco',     'Riva',     'marco@mail.it',     '$2a$10$jqnVvYGbBY2x7o79a0LsGupXnp656mp5av.xpx08y/XWzgrq/6n06', 'utente'),
(10, 'Anna',      'Gallo',    'anna@mail.it',      '$2a$10$4I3xUBwJ.oexMRilXi.ui.2B0iiYwz07l7.sEX54mazugbXjzHjVW', 'utente'),
(11, 'Davide',    'Fontana',  'davide@mail.it',    '$2a$10$xef84.7U3z9ZaUVzkNr6BebkIGOslgdwmGqz26IJJZqZLG2/UI.am', 'utente'),
(12, 'Francesco', 'Romano',   'francesco@mail.it', '$2a$10$4q/XubQtXyavwhSPwFn0NO2Nf9UbLwy5Hi23Zv4hzvoUpH.BQViFi', 'utente'),
(13, 'Chiara',    'Ricci',    'chiara@mail.it',    '$2a$10$gn2S7WHgk0LNzYztrgg8KuYT8BTA4fQJNBdUis0vkMTb9VT8a6Q1W', 'utente'),
(14, 'Matteo',    'Greco',    'matteo@mail.it',    '$2a$10$bv00b1zh93pPm8vHJbWjg.SJZ38WaNSWF.ivloUPhBLPSYakpnulq', 'utente'),
(15, 'Alessia',   'Marino',   'alessia@mail.it',   '$2a$10$OBKWCj9a0rn1Tg0NcRskiuZO78jBlEY1Snppf35PAxaKfuxZs/TiC', 'utente'),
(16, 'Lorenzo',   'Bruno',    'lorenzo@mail.it',   '$2a$10$/grWTyHpeDydaGURVXjsTO9RqdU03qqpz4oA36NxOo43TGo03qEdy', 'utente'),
(17, 'Federica',  'Costa',    'federica@mail.it',  '$2a$10$EhI4axh9ywVDh.qPQD3kMeNjtMlT75Hom1RCF/tqzyafuaO0ELSey', 'utente'),
(18, 'Andrea',    'Ferrari',  'andrea@mail.it',    '$2a$10$FfHkDtZS.wRRQflXt5N7Z.cY/FfQY0YiJYBJW9MeNm.ONWMuTrnme', 'utente'),
(19, 'Martina',   'Esposito', 'martina@mail.it',   '$2a$10$FwMwhNvT5JkfLUaJIkqdLe04I9JXVMWCU.HM27eaYUMCQ4g/W.646', 'utente');

INSERT INTO categoria (id_categoria, nome) OVERRIDING SYSTEM VALUE VALUES
(1, 'Sparatutto'),
(2, 'Calcio'),
(3, 'Battle Royale'),
(4, 'Picchiaduro'),
(5, 'Strategia');

INSERT INTO torneo (id_torneo, nome, descrizione, gioco, id_categoria, modalita, giocatori_per_squadra, data_inizio, data_fine, posti_max, stato, foto) OVERRIDING SYSTEM VALUE VALUES
(1, 'Fortnite Summer Cup',     'Torneo a coppie su due partite, vince chi somma più eliminazioni.', 'Fortnite',            3, 'duo',     2, '2026-06-20 18:00', '2026-06-21 20:00', 8,  'concluso', 'img/fortnite.png'),
(2, 'Street Fighter Showdown', 'Eliminazione diretta al meglio dei 3 round.',                       'Street Fighter 6',    4, 'singolo', 1, '2026-07-11 16:00', '2026-07-12 20:00', 8,  'concluso', 'img/street.png'),
(3, 'Rocket League Arena',     'Squadre da 3, girone all''italiana.',                               'Rocket League',       2, 'squadra', 3, '2026-09-05 15:00', '2026-09-06 18:00', 4,  'concluso', 'img/rocket.png'),
(4, 'Lega R6 d''autunno',      'Squadre da 3, una giornata a settimana.',                            'Rainbow Six Siege',   1, 'squadra', 3, '2026-10-10 21:00', '2026-10-24 23:00', 4,  'chiuso',   'img/R6.png'),
(5, 'FIFA Cup ITS',            'Sfida 1 contro 1 a eliminazione diretta.',                          'EA Sports FC 26',     2, 'singolo', 1, '2026-10-12 18:00', '2026-10-18 20:00', 8,  'chiuso',   'img/fifa.png'),
(6, 'Clash Royale Masters',    'Tutti contro tutti, poi fase finale a eliminazione diretta.',       'Clash Royale',        5, 'singolo', 1, '2026-10-25 15:00', '2026-10-26 19:00', 16, 'aperto',   'img/clashroyale.png'),
(7, 'Mortal Kombat Night',     'Una serata di sfide 1 contro 1.',                                    'Mortal Kombat 1',     4, 'singolo', 1, '2026-11-07 20:00', '2026-11-07 23:30', 8,  'aperto',   'img/mortal.png'),
(8, 'LoL Duo Challenge',       'Coppie in Landa degli Ululati, eliminazione diretta.',               'League of Legends',   5, 'duo',     2, '2026-11-14 15:00', '2026-11-15 20:00', 8,  'aperto',   'img/lol.png');

INSERT INTO squadra (id_squadra, id_torneo, nome, id_capitano) OVERRIDING SYSTEM VALUE VALUES
(1,  1, 'Storm Riders',     3),
(2,  1, 'Night Owls',       5),
(3,  1, 'Pixel Wolves',     8),
(4,  1, 'Zero Build',       12),
(5,  2, 'Paolo Gallo',      6),
(6,  2, 'Elena Conti',      7),
(7,  2, 'Davide Fontana',   11),
(8,  2, 'Matteo Greco',     14),
(9,  3, 'Turbo Boost',      4),
(10, 3, 'Aerial Kings',     9),
(11, 3, 'Demo Squad',       17),
(12, 4, 'Vipers',           3),
(13, 4, 'Black Ice',        8),
(14, 4, 'Breach Team',      18),
(15, 5, 'Luca Verdi',       4),
(16, 5, 'Anna Gallo',       10),
(17, 5, 'Alessia Marino',   15),
(18, 5, 'Martina Esposito', 19),
(19, 6, 'Mario Rossi',      3),
(20, 6, 'Sara Neri',        5),
(21, 6, 'Paolo Gallo',      6),
(22, 6, 'Federica Costa',   17),
(23, 6, 'Davide Fontana',   11),
(24, 7, 'Elena Conti',      7),
(25, 7, 'Marco Riva',       9),
(26, 7, 'Francesco Romano', 12),
(27, 8, 'Mid or Feed',      13),
(28, 8, 'Baron Hunters',    10);

INSERT INTO iscrizione (id_torneo, id_utente, id_squadra, data) VALUES
(1, 3,  1,  '2026-06-02 19:10'),
(1, 4,  1,  '2026-06-02 19:10'),
(1, 5,  2,  '2026-06-04 21:30'),
(1, 6,  2,  '2026-06-04 21:30'),
(1, 8,  3,  '2026-06-08 17:45'),
(1, 9,  3,  '2026-06-08 17:45'),
(1, 12, 4,  '2026-06-12 10:20'),
(1, 13, 4,  '2026-06-12 10:20'),
(2, 6,  5,  '2026-06-25 18:00'),
(2, 7,  6,  '2026-06-27 09:15'),
(2, 11, 7,  '2026-07-01 20:40'),
(2, 14, 8,  '2026-07-03 14:05'),
(3, 4,  9,  '2026-08-18 16:30'),
(3, 15, 9,  '2026-08-18 16:30'),
(3, 16, 9,  '2026-08-18 16:30'),
(3, 9,  10, '2026-08-21 21:00'),
(3, 10, 10, '2026-08-21 21:00'),
(3, 18, 10, '2026-08-21 21:00'),
(3, 17, 11, '2026-08-27 11:50'),
(3, 19, 11, '2026-08-27 11:50'),
(3, 11, 11, '2026-08-27 11:50'),
(4, 3,  12, '2026-09-22 18:25'),
(4, 5,  12, '2026-09-22 18:25'),
(4, 14, 12, '2026-09-22 18:25'),
(4, 8,  13, '2026-09-25 20:10'),
(4, 13, 13, '2026-09-25 20:10'),
(4, 16, 13, '2026-09-25 20:10'),
(4, 18, 14, '2026-10-01 15:35'),
(4, 12, 14, '2026-10-01 15:35'),
(4, 7,  14, '2026-10-01 15:35'),
(5, 4,  15, '2026-09-28 12:00'),
(5, 10, 16, '2026-09-30 19:20'),
(5, 15, 17, '2026-10-03 08:45'),
(5, 19, 18, '2026-10-06 22:10'),
(6, 3,  19, '2026-10-05 17:30'),
(6, 5,  20, '2026-10-07 13:15'),
(6, 6,  21, '2026-10-09 21:05'),
(6, 17, 22, '2026-10-11 10:40'),
(6, 11, 23, '2026-10-13 18:55'),
(7, 7,  24, '2026-10-08 20:30'),
(7, 9,  25, '2026-10-10 16:10'),
(7, 12, 26, '2026-10-13 11:25'),
(8, 13, 27, '2026-10-11 19:00'),
(8, 14, 27, '2026-10-11 19:00'),
(8, 10, 28, '2026-10-12 21:45'),
(8, 8,  28, '2026-10-12 21:45');

INSERT INTO partita (id_partita, id_torneo, turno, data_ora, stato) OVERRIDING SYSTEM VALUE VALUES
(1,  1, 'Partita 1',    '2026-06-20 18:00', 'conclusa'),
(2,  1, 'Partita 2',    '2026-06-21 18:00', 'conclusa'),
(3,  2, 'Semifinale 1', '2026-07-11 16:00', 'conclusa'),
(4,  2, 'Semifinale 2', '2026-07-11 17:00', 'conclusa'),
(5,  2, 'Finale',       '2026-07-12 18:00', 'conclusa'),
(6,  3, 'Giornata 1',   '2026-09-05 15:00', 'conclusa'),
(7,  3, 'Giornata 2',   '2026-09-05 17:00', 'conclusa'),
(8,  3, 'Giornata 3',   '2026-09-06 15:00', 'conclusa'),
(9,  4, 'Giornata 1',   '2026-10-10 21:00', 'conclusa'),
(10, 4, 'Giornata 2',   '2026-10-13 21:00', 'conclusa'),
(11, 4, 'Giornata 3',   '2026-10-16 21:00', 'programmata'),
(12, 5, 'Semifinale 1', '2026-10-12 18:00', 'conclusa'),
(13, 5, 'Semifinale 2', '2026-10-13 18:00', 'conclusa'),
(14, 5, 'Finale',       '2026-10-18 18:00', 'programmata');

INSERT INTO partita_squadra (id_partita, id_squadra, id_torneo, punti) VALUES
(1,  1,  1, 12),
(1,  2,  1, 7),
(1,  3,  1, 15),
(1,  4,  1, 4),
(2,  1,  1, 18),
(2,  2,  1, 5),
(2,  3,  1, 9),
(2,  4,  1, 11),
(3,  5,  2, 2),
(3,  6,  2, 1),
(4,  7,  2, 0),
(4,  8,  2, 2),
(5,  5,  2, 1),
(5,  8,  2, 2),
(6,  9,  3, 3),
(6,  10, 3, 2),
(7,  10, 3, 4),
(7,  11, 3, 1),
(8,  9,  3, 2),
(8,  11, 3, 2),
(9,  12, 4, 7),
(9,  13, 4, 5),
(10, 13, 4, 7),
(10, 14, 4, 4),
(11, 12, 4, NULL),
(11, 14, 4, NULL),
(12, 15, 5, 3),
(12, 16, 5, 1),
(13, 17, 5, 1),
(13, 18, 5, 2),
(14, 15, 5, NULL),
(14, 18, 5, NULL);

INSERT INTO punti_giocatore (id_partita, id_utente, id_squadra, punti) VALUES
(1, 3,  1,  8),
(1, 4,  1,  4),
(1, 5,  2,  5),
(1, 6,  2,  2),
(1, 8,  3,  9),
(1, 9,  3,  6),
(1, 12, 4,  3),
(1, 13, 4,  1),
(2, 3,  1,  10),
(2, 4,  1,  8),
(2, 5,  2,  3),
(2, 6,  2,  2),
(2, 8,  3,  4),
(2, 9,  3,  5),
(2, 12, 4,  7),
(2, 13, 4,  4),
(9, 3,  12, 3),
(9, 5,  12, 2),
(9, 14, 12, 2),
(9, 8,  13, 2),
(9, 13, 13, 2),
(9, 16, 13, 1);

INSERT INTO giocata (id_giocata, id_torneo, id_partita, id_utente, titolo, id_youtube, inizio_sec, fine_sec) OVERRIDING SYSTEM VALUE VALUES
(1, 4, 9,    3,  'Clip R6',           'HOdTUJylJeg', 0, 15),
(2, 4, 10,   18, 'Clip Beaulo',       '14XIiU5t3_o', 1, 7),
(3, 1, 2,    8,  'Clip Fortnite',     'J-Yjyr6OM4Y', 0, 22),
(4, 7, NULL, 9,  'The best comeback', 'pXxwFCwoUH0', 0, 54);

INSERT INTO iscrizione (id_torneo, id_utente, id_squadra, data) VALUES
(4, 4,  12, '2026-09-22 18:25'),
(4, 6,  12, '2026-09-22 18:25'),
(4, 9,  13, '2026-09-25 20:10'),
(4, 11, 13, '2026-09-25 20:10'),
(4, 15, 14, '2026-10-01 15:35'),
(4, 17, 14, '2026-10-01 15:35');

INSERT INTO iscrizione (id_torneo, id_utente, id_squadra, data) VALUES
(8, 16, 27, '2026-10-11 19:00'),
(8, 18, 27, '2026-10-11 19:00'),
(8, 19, 27, '2026-10-11 19:00'),
(8, 3,  28, '2026-10-12 21:45'),
(8, 5,  28, '2026-10-12 21:45'),
(8, 7,  28, '2026-10-12 21:45');

INSERT INTO iscrizione (id_torneo, id_utente, id_squadra, data) VALUES
(9,  3,  29, '2026-07-20 18:00'),
(9,  4,  29, '2026-07-20 18:00'),
(9,  5,  29, '2026-07-20 18:00'),
(9,  6,  29, '2026-07-20 18:00'),
(9,  7,  29, '2026-07-20 18:00'),
(9,  8,  30, '2026-07-22 21:00'),
(9,  9,  30, '2026-07-22 21:00'),
(9,  10, 30, '2026-07-22 21:00'),
(9,  11, 30, '2026-07-22 21:00'),
(9,  12, 30, '2026-07-22 21:00'),
(10, 13, 31, '2026-08-10 10:00'),
(10, 15, 32, '2026-08-11 17:30'),
(10, 17, 33, '2026-08-13 20:15'),
(10, 19, 34, '2026-08-15 09:40');

INSERT INTO iscrizione (id_torneo, id_utente, id_squadra, data) VALUES
(11, 9,  35, '2026-08-30 19:10'),
(11, 14, 36, '2026-09-01 12:30'),
(11, 16, 37, '2026-09-03 21:00'),
(11, 18, 38, '2026-09-05 16:45');

INSERT INTO iscrizione (id_torneo, id_utente, id_squadra, data) VALUES
(12, 14, 39, '2026-10-10 18:20'),
(12, 11, 40, '2026-10-11 21:05'),
(12, 8,  41, '2026-10-13 12:40'),
(13, 4,  42, '2026-10-12 19:30'),
(13, 6,  42, '2026-10-12 19:30'),
(14, 15, 43, '2026-10-11 16:15'),
(14, 16, 43, '2026-10-11 16:15'),
(14, 17, 43, '2026-10-11 16:15'),
(15, 9,  44, '2026-10-13 22:00'),
(15, 10, 45, '2026-10-14 09:10');

INSERT INTO partita (id_partita, id_torneo, turno, data_ora, stato) OVERRIDING SYSTEM VALUE VALUES
(15, 9,  'Finale',       '2026-08-01 18:00', 'conclusa'),
(16, 10, 'Semifinale 1', '2026-08-22 16:00', 'conclusa'),
(17, 10, 'Semifinale 2', '2026-08-22 16:45', 'conclusa'),
(18, 10, 'Finale',       '2026-08-22 18:00', 'conclusa');

INSERT INTO partita (id_partita, id_torneo, turno, data_ora, stato) OVERRIDING SYSTEM VALUE VALUES
(19, 11, 'Semifinale 1', '2026-09-12 20:00', 'conclusa'),
(20, 11, 'Semifinale 2', '2026-09-12 20:45', 'conclusa'),
(21, 11, 'Finale',       '2026-09-12 22:00', 'conclusa');

INSERT INTO partita_squadra (id_partita, id_squadra, id_torneo, punti) VALUES
(15, 29, 9,  5),
(15, 30, 9,  3),
(16, 31, 10, 2),
(16, 32, 10, 1),
(17, 33, 10, 0),
(17, 34, 10, 2),
(18, 31, 10, 2),
(18, 34, 10, 1);

INSERT INTO partita_squadra (id_partita, id_squadra, id_torneo, punti) VALUES
(19, 35, 11, 2),
(19, 37, 11, 1),
(20, 36, 11, 2),
(20, 38, 11, 0),
(21, 35, 11, 2),
(21, 36, 11, 1);

INSERT INTO punti_giocatore (id_partita, id_utente, id_squadra, punti) VALUES
(9, 4,  12, 2),
(9, 6,  12, 0),
(9, 9,  13, 2),
(9, 11, 13, 0);

INSERT INTO squadra (id_squadra, id_torneo, nome, id_capitano) OVERRIDING SYSTEM VALUE VALUES
(29, 9,  'Red Wolves',       3),
(30, 9,  'Night Raid',       8),
(31, 10, 'Chiara Ricci',     13),
(32, 10, 'Alessia Marino',   15),
(33, 10, 'Federica Costa',   17),
(34, 10, 'Martina Esposito', 19);

INSERT INTO squadra (id_squadra, id_torneo, nome, id_capitano) OVERRIDING SYSTEM VALUE VALUES
(35, 11, 'Marco Riva',     9),
(36, 11, 'Matteo Greco',   14),
(37, 11, 'Lorenzo Bruno',  16),
(38, 11, 'Andrea Ferrari', 18);

INSERT INTO squadra (id_squadra, id_torneo, nome, id_capitano) OVERRIDING SYSTEM VALUE VALUES
(39, 12, 'Matteo Greco',   14),
(40, 12, 'Davide Fontana', 11),
(41, 12, 'Giulia Bianchi', 8),
(42, 13, 'Storm Riders',   4),
(43, 14, 'Turbo Boost',    15),
(44, 15, 'Marco Riva',     9),
(45, 15, 'Anna Gallo',     10);

INSERT INTO torneo (id_torneo, nome, descrizione, gioco, id_categoria, modalita, giocatori_per_squadra, data_inizio, data_fine, posti_max, stato, foto) OVERRIDING SYSTEM VALUE VALUES
(9,  'R6 Summer Major',         'Squadre da 5, finale secca al meglio di 9 round.', 'Rainbow Six Siege', 1, 'squadra', 5, '2026-08-01 18:00', '2026-08-01 22:00', 4, 'concluso', 'img/R6.png'),
(10, 'Clash Royale Summer Cup', 'Sfida 1 contro 1 a eliminazione diretta.',         'Clash Royale',      5, 'singolo', 1, '2026-08-22 16:00', '2026-08-22 19:00', 8, 'concluso', 'img/clashroyale.png');

INSERT INTO torneo (id_torneo, nome, descrizione, gioco, id_categoria, modalita, giocatori_per_squadra, data_inizio, data_fine, posti_max, stato, foto) OVERRIDING SYSTEM VALUE VALUES
(11, 'Mortal Kombat Summer Fight', 'Sfida 1 contro 1 a eliminazione diretta, al meglio dei 3 round.', 'Mortal Kombat 1', 4, 'singolo', 1, '2026-09-12 20:00', '2026-09-12 23:00', 8, 'concluso', 'img/mortal.png');

INSERT INTO torneo (id_torneo, nome, descrizione, gioco, id_categoria, modalita, giocatori_per_squadra, data_inizio, data_fine, posti_max, stato, foto) OVERRIDING SYSTEM VALUE VALUES
(12, 'Street Fighter Rush',   'Sfide 1 contro 1 al meglio dei 3 round, eliminazione diretta.', 'Street Fighter 6',  4, 'singolo', 1, '2026-10-16 20:00', '2026-10-16 23:00', 16, 'aperto', 'img/street.png'),
(13, 'Fortnite Autumn Cup',   'Coppie, tre partite: vince chi somma più eliminazioni.',        'Fortnite',          3, 'duo',     2, '2026-10-17 18:00', '2026-10-17 22:00', 50, 'aperto', 'img/fortnite.png'),
(14, 'Rocket League Weekend', 'Squadre da 3, gironi e finale.',                                'Rocket League',     2, 'squadra', 3, '2026-10-18 15:00', '2026-10-18 19:00', 8,  'aperto', 'img/rocket.png'),
(15, 'EA FC Derby Night',     'Sfida 1 contro 1, partite da 6 minuti.',                        'EA Sports FC 26',   2, 'singolo', 1, '2026-10-19 21:00', '2026-10-19 23:30', 8,  'aperto', 'img/fifa.png'),
(16, 'R6 Open Qualifier',     'Squadre da 5, qualificazione al prossimo major.',               'Rainbow Six Siege', 1, 'squadra', 5, '2026-10-20 20:00', '2026-10-20 23:59', 8,  'aperto', 'img/R6.png');

---- Nuova insert 
INSERT INTO impostazione (chiave, valore) VALUES ('max_tornei_attivi', 3);