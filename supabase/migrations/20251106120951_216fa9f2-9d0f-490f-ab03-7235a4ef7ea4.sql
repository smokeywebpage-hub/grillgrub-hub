-- Rimuovo il constraint sulla categoria per permettere categorie dinamiche
ALTER TABLE menu_items DROP CONSTRAINT IF EXISTS menu_items_category_check;