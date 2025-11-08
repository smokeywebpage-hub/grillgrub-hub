-- Pulizia eventuale duplicati
DELETE FROM site_content WHERE section IN ('homepage', 'b2b', 'prenotazioni');
DELETE FROM site_images WHERE section = 'homepage';

-- Inserimento contenuti homepage
INSERT INTO site_content (key, section, value, description) VALUES
  ('homepage_hero_title', 'homepage', 'Smokey', 'Titolo principale hero'),
  ('homepage_hero_subtitle', 'homepage', 'L''Arte della Grigliatura', 'Sottotitolo hero'),
  ('homepage_hero_description', 'homepage', 'Hamburger gourmet e carni premium preparate alla perfezione. Un''esperienza culinaria indimenticabile.', 'Descrizione hero'),
  ('homepage_hero_button_1', 'homepage', 'Scopri il Menu', 'Testo primo pulsante hero'),
  ('homepage_hero_button_2', 'homepage', 'Ordini B2B', 'Testo secondo pulsante hero'),
  ('homepage_features_title', 'homepage', 'Perché Sceglierci', 'Titolo sezione caratteristiche'),
  ('homepage_features_subtitle', 'homepage', 'Eccellenza in ogni boccone', 'Sottotitolo sezione caratteristiche'),
  ('homepage_feature_1_title', 'homepage', 'Carne di Qualità', 'Titolo caratteristica 1'),
  ('homepage_feature_1_description', 'homepage', 'Selezioniamo solo le migliori carni da allevamenti certificati, garantendo freschezza e sapore autentico.', 'Descrizione caratteristica 1'),
  ('homepage_feature_2_title', 'homepage', 'Chef Esperti', 'Titolo caratteristica 2'),
  ('homepage_feature_2_description', 'homepage', 'I nostri chef hanno anni di esperienza nella grigliatura e nella preparazione di hamburger gourmet.', 'Descrizione caratteristica 2'),
  ('homepage_feature_3_title', 'homepage', 'Premiati', 'Titolo caratteristica 3'),
  ('homepage_feature_3_description', 'homepage', 'Riconosciuti come uno dei migliori ristoranti di carne della città per 3 anni consecutivi.', 'Descrizione caratteristica 3'),
  ('homepage_cta_title', 'homepage', 'Pronto a Gustare?', 'Titolo call to action'),
  ('homepage_cta_description', 'homepage', 'Visita il nostro ristorante e scopri il vero sapore della carne grigliata alla perfezione', 'Descrizione call to action'),
  ('homepage_cta_button', 'homepage', 'Esplora il Menu Completo', 'Testo pulsante call to action');

-- Inserimento contenuti pagina B2B
INSERT INTO site_content (key, section, value, description) VALUES
  ('b2b_page_title', 'b2b', 'Fornitura B2B', 'Titolo pagina B2B'),
  ('b2b_page_subtitle', 'b2b', 'Carni premium selezionate per ristoranti e attività commerciali. Scegli il prodotto e richiedi una fornitura personalizzata.', 'Sottotitolo pagina B2B'),
  ('b2b_benefit_1_title', 'b2b', 'Qualità Premium', 'Titolo beneficio 1'),
  ('b2b_benefit_1_description', 'b2b', 'Solo le migliori carni selezionate per il tuo business', 'Descrizione beneficio 1'),
  ('b2b_benefit_2_title', 'b2b', 'Consegna Rapida', 'Titolo beneficio 2'),
  ('b2b_benefit_2_description', 'b2b', 'Consegne puntuali e affidabili in tutta la regione', 'Descrizione beneficio 2'),
  ('b2b_benefit_3_title', 'b2b', 'Prezzi Competitivi', 'Titolo beneficio 3'),
  ('b2b_benefit_3_description', 'b2b', 'Tariffe vantaggiose per ordini all''ingrosso', 'Descrizione beneficio 3'),
  ('b2b_product_cta', 'b2b', 'Clicca per richiedere una fornitura →', 'Testo CTA prodotti');

-- Inserimento contenuti pagina Prenotazioni
INSERT INTO site_content (key, section, value, description) VALUES
  ('prenotazioni_page_title', 'prenotazioni', 'Prenotazioni B2B', 'Titolo pagina prenotazioni'),
  ('prenotazioni_page_subtitle', 'prenotazioni', 'Forniamo carni premium per ristoranti e attività commerciali', 'Sottotitolo pagina prenotazioni'),
  ('prenotazioni_form_title', 'prenotazioni', 'Richiesta di Fornitura', 'Titolo form'),
  ('prenotazioni_form_description', 'prenotazioni', 'Compila il form per richiedere una fornitura di carni per il tuo ristorante', 'Descrizione form'),
  ('prenotazioni_benefit_1_title', 'prenotazioni', 'Qualità Premium', 'Titolo beneficio 1'),
  ('prenotazioni_benefit_1_description', 'prenotazioni', 'Solo le migliori carni selezionate per il tuo business', 'Descrizione beneficio 1'),
  ('prenotazioni_benefit_2_title', 'prenotazioni', 'Consegna Rapida', 'Titolo beneficio 2'),
  ('prenotazioni_benefit_2_description', 'prenotazioni', 'Consegne puntuali e affidabili in tutta la regione', 'Descrizione beneficio 2'),
  ('prenotazioni_benefit_3_title', 'prenotazioni', 'Prezzi Competitivi', 'Titolo beneficio 3'),
  ('prenotazioni_benefit_3_description', 'prenotazioni', 'Tariffe vantaggiose per ordini all''ingrosso', 'Descrizione beneficio 3'),
  ('prenotazioni_submit_button', 'prenotazioni', 'Invia Richiesta', 'Testo pulsante invio'),
  ('prenotazioni_submit_button_loading', 'prenotazioni', 'Invio in corso...', 'Testo pulsante durante invio');

-- Inserimento immagini homepage
INSERT INTO site_images (key, section, url, alt_text, description) VALUES
  ('homepage_hero_image', 'homepage', '/src/assets/hero-burger.jpg', 'Hero burger', 'Immagine hero homepage');