INSERT INTO utente (id_utente, nome, cognome, email, password_hash, ruolo) OVERRIDING SYSTEM VALUE VALUES
(1,  'Admin',  'ITS',      'admin@its.it',   '$2a$10$iK2nsWBuqxN7tN6QZLuZw.JZG1dAGmkJ4QhzLQ1EozD68pxnKKefO', 'admin'),
(2,  'Simone', 'Admin',    'simone@its.it',  '$2a$10$26yX8XrHsh7I74sER48W3O4fBU81xhlynDUJkswcCRhu5EkkfsC/m', 'admin'),
(12, 'Mario',  'Rossi',    'mario@mail.it',  '$2a$10$1OZyWuSPbYkvjSBKKtlsAOJUIaL2uVoomb1ViYup306YIMFlK6dCy', 'utente'),
(13, 'Luca',   'Verdi',    'luca@mail.it',   '$2a$10$GGxdyXcUAroAClQSaVFJOuXa/vkw2WxNKna.Ly/T5aLc5huQ/CWhm', 'utente'),
(14, 'Sara',   'Neri',     'sara@mail.it',   '$2a$10$W2p64n41XvKYYXY2WTP8de8fFLu7J8kN4Ry2cUJWTgfH6mq1dAA8G', 'utente'),
(15, 'Paolo',  'Gallo',    'paolo@mail.it',  '$2a$10$2bn8nOP//mcnf0Xc.7B1te.udkRubEXrtQ3XtZJnuHUrFVUzlgXXm', 'utente'),
(16, 'Elena',  'Conti',    'elena@mail.it',  '$2a$10$6D4WJJRCOMLoNxnkAYvSgew8zO7rJYTnnPmW/qIPZqNlRlXwtsjjy', 'utente'),
(17, 'Giulia', 'Bianchi',  'giulia@mail.it', '$2a$10$NTvM9TAQYyVhw2WlJriI1OfNRpl5p05OHfzeAm6eYFW4G1/eYq8GS', 'utente'),
(18, 'Marco',  'Riva',     'marco@mail.it',  '$2a$10$jqnVvYGbBY2x7o79a0LsGupXnp656mp5av.xpx08y/XWzgrq/6n06', 'utente'),
(19, 'Anna',   'Gallo',    'anna@mail.it',   '$2a$10$4I3xUBwJ.oexMRilXi.ui.2B0iiYwz07l7.sEX54mazugbXjzHjVW', 'utente'),
(20, 'Davide', 'Fontana',  'davide@mail.it', '$2a$10$xef84.7U3z9ZaUVzkNr6BebkIGOslgdwmGqz26IJJZqZLG2/UI.am', 'utente');

SELECT setval(pg_get_serial_sequence('utente', 'id_utente'), (SELECT MAX(id_utente) FROM utente));