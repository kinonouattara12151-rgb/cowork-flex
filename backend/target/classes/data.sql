-- ── Espaces ────────────────────────────────────────────────────────────────────
INSERT INTO space (id, name, city, address, rating, review_count, capacity, available, amenities, image_id, price_from, description) VALUES
(1, 'Plateau Hub',           'Abidjan',       'Avenue Nogues, Le Plateau, Abidjan',                    4.8, 214, 150, 42, 'wifi,coffee,printer,parking', 'photo-1497366754035-f200968a6e72', 10, 'Espace moderne au cœur du Plateau, quartier des affaires d''Abidjan.'),
(2, 'Cocody Lab',            'Abidjan',       'Rue des Jardins, Cocody, Abidjan',                      4.7, 178, 120, 35, 'wifi,coffee,printer',         'photo-1521737604893-d14cc237f11d',  8, 'Cadre verdoyant à Cocody pour freelances et startups.'),
(3, 'Marcory Work',          'Abidjan',       'Boulevard de Marseille, Marcory, Abidjan',               4.5, 132,  80, 22, 'wifi,coffee,parking',         'photo-1497366412874-3415097a27e7',  7, 'Espace accessible et bien connecté dans le quartier de Marcory.'),
(4, 'Yopougon Space',        'Abidjan',       'Avenue Pierre Fakhoury, Yopougon, Abidjan',             4.4,  98,  60, 18, 'wifi,coffee',                 'photo-1556761175-4b46a572b786',     6, 'Coworking de proximité à Yopougon, idéal pour les entrepreneurs locaux.'),
(5, 'Yamoussoukro Connect',  'Yamoussoukro',  'Avenue Houphouët-Boigny, Yamoussoukro',                 4.6,  87,  90, 28, 'wifi,printer,parking',        'photo-1497366811353-6870744d04b2',  7, 'Au cœur de la capitale politique, un espace calme et bien équipé.'),
(6, 'Man Cowork',            'Man',           'Centre-ville, Man, Région du Tonkpi',                   4.3,  54,  40, 15, 'wifi,coffee',                 'photo-1497366216548-37526070297c',  5, 'Niché dans la ville aux 18 montagnes, un espace inspirant.'),
(7, 'Daloa Hub',             'Daloa',         'Quartier Commerce, Daloa, Région du Haut-Sassandra',    4.4,  61,  50, 16, 'wifi,printer,coffee',         'photo-1554224155-6726b3ff858f',     5, 'Espace dynamique au centre de Daloa.'),
(8, 'Gagnoa Work',           'Gagnoa',        'Avenue de la Paix, Gagnoa, Région du Gôh',              4.2,  43,  35, 12, 'wifi,coffee',                 'photo-1497366754035-f200968a6e72',  5, 'Petit espace convivial pour professionnels et étudiants à Gagnoa.'),
(9, 'Soubré Digital',        'Soubré',        'Quartier Administratif, Soubré, Région de la Nawa',     4.1,  38,  30, 10, 'wifi,coffee',                 'photo-1521737604893-d14cc237f11d',  4, 'Premier espace de coworking de la capitale du cacao ivoirien.'),
(10,'Bouaké Central',        'Bouaké',        'Avenue de la République, Bouaké, Région du Gbêkê',      4.6, 143, 110, 33, 'wifi,parking,printer,coffee', 'photo-1497366412874-3415097a27e7',  7, 'Le plus grand coworking du centre du pays.'),
(11,'San-Pédro Bay',         'San-Pédro',     'Zone Portuaire, San-Pédro',                             4.5,  76,  65, 20, 'wifi,parking,coffee',         'photo-1556761175-4b46a572b786',     6, 'Vue sur le port, idéal pour les professionnels du commerce maritime.'),
(12,'Nexus Hub',             'Paris',         '42 Rue du Faubourg Saint-Antoine, 75011',               4.8, 312, 120, 34, 'wifi,parking,printer,coffee', 'photo-1497366216548-37526070297c', 18, 'Cœur de Bastille, loft industriel avec plafonds à 5m et terrasse panoramique.'),
(13,'Atelier Nord',          'Paris',         '18 Rue de la Chapelle, 75018',                          4.6, 189,  80, 12, 'wifi,coffee,printer',         'photo-1497366811353-6870744d04b2', 14, 'Ancienne imprimerie avec briques apparentes et cabines téléphoniques.'),
(14,'Station Lyon',          'Lyon',          '7 Place Bellecour, 69002',                              4.9, 427, 200, 61, 'wifi,parking,printer,coffee', 'photo-1521737604893-d14cc237f11d', 16, 'Espace phare sur la Place Bellecour avec 3 auditoriums.'),
(15,'Le Dock',               'Marseille',     '2 Place de la Joliette, 13002',                         4.7, 204, 150, 48, 'wifi,coffee,parking',         'photo-1497366754035-f200968a6e72', 12, 'Ancien dock réinventé en campus créatif maritime avec vue sur mer.'),
(16,'Confluence Lab',        'Lyon',          '112 Cours Charlemagne, 69002',                          4.5, 156,  90, 27, 'wifi,printer,coffee',         'photo-1497366412874-3415097a27e7', 15, 'Plateaux lumineux dans le quartier Confluence.'),
(17,'Quartier Libre',        'Bordeaux',      '28 Quai des Chartrons, 33000',                          4.7, 261, 110, 19, 'wifi,parking,coffee',         'photo-1556761175-4b46a572b786',    13, 'Patrimoine et tech : bâtiment haussmannien en bord de Garonne.');

-- ── Postes ──────────────────────────────────────────────────────────────────────
INSERT INTO desk (id, space_id, name, type, capacity, price_per_hour, available, floor) VALUES
-- Plateau Hub
(1,  1, 'Open Desk P-01',   'OPEN',    1,  5, true, 1),
(2,  1, 'Open Desk P-02',   'OPEN',    1,  5, true, 1),
(3,  1, 'Salle Abissa',     'MEETING', 8, 20, true, 2),
(4,  1, 'Bureau Privé 101', 'PRIVATE', 3, 15, true, 1),
-- Cocody Lab
(5,  2, 'Open Desk C-01',   'OPEN',    1,  4, true, 1),
(6,  2, 'Open Desk C-02',   'OPEN',    1,  4, true, 1),
(7,  2, 'Salle Lagune',     'MEETING', 6, 16, true, 2),
(8,  2, 'Bureau Privé 201', 'PRIVATE', 2, 12, true, 2),
-- Marcory Work
(9,  3, 'Open Desk M-01',   'OPEN',    1,  4, true, 1),
(10, 3, 'Salle Ébrié',      'MEETING', 8, 18, true, 1),
(11, 3, 'Bureau Privé 101', 'PRIVATE', 2, 10, true, 1),
-- Yopougon Space
(12, 4, 'Open Desk Y-01',   'OPEN',    1,  3, true, 1),
(13, 4, 'Open Desk Y-02',   'OPEN',    1,  3, true, 1),
(14, 4, 'Salle Banco',      'MEETING', 6, 12, true, 1),
-- Yamoussoukro
(15, 5, 'Open Desk Y-01',   'OPEN',    1,  4, true, 1),
(16, 5, 'Salle Basilique',  'MEETING',10, 18, true, 2),
(17, 5, 'Bureau Privé 101', 'PRIVATE', 3, 12, true, 1),
-- Man
(18, 6, 'Open Desk M-01',   'OPEN',    1,  3, true, 1),
(19, 6, 'Salle Mont Nimba', 'MEETING', 6, 12, true, 1),
-- Daloa
(20, 7, 'Open Desk D-01',   'OPEN',    1,  3, true, 1),
(21, 7, 'Salle Sassandra',  'MEETING', 8, 14, true, 1),
(22, 7, 'Bureau Privé 101', 'PRIVATE', 2, 10, true, 1),
-- Gagnoa
(23, 8, 'Open Desk G-01',   'OPEN',    1,  3, true, 1),
(24, 8, 'Salle Gôh',        'MEETING', 6, 10, true, 1),
-- Soubré
(25, 9, 'Open Desk S-01',   'OPEN',    1,  2, true, 1),
(26, 9, 'Salle Cacao',      'MEETING', 6, 10, true, 1),
-- Bouaké
(27,10, 'Open Desk B-01',   'OPEN',    1,  4, true, 1),
(28,10, 'Open Desk B-02',   'OPEN',    1,  4, true, 1),
(29,10, 'Salle Gbêkê',      'MEETING',12, 20, true, 2),
(30,10, 'Bureau Privé 201', 'PRIVATE', 4, 14, true, 2),
-- San-Pédro
(31,11, 'Open Desk SP-01',  'OPEN',    1,  3, true, 1),
(32,11, 'Salle Port',       'MEETING', 8, 16, true, 1),
(33,11, 'Bureau Privé 101', 'PRIVATE', 2, 10, true, 1),
-- Nexus Hub Paris
(34,12, 'Open Desk A-14',   'OPEN',    1,  8, true, 1),
(35,12, 'Salle Atlas',      'MEETING', 8, 35, true, 2),
(36,12, 'Bureau Privé 101', 'PRIVATE', 2, 22, false,1),
-- Atelier Nord Paris
(37,13, 'Open Desk C-01',   'OPEN',    1,  7, true, 1),
(38,13, 'Salle Lumière',    'MEETING', 6, 28, true, 2),
-- Station Lyon
(39,14, 'Open Desk D-22',   'OPEN',    1,  9, true, 1),
(40,14, 'Salle Summit',     'MEETING',20, 80, true, 4);
