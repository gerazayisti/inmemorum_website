-- ============================================================
-- SQL SCHEMA FOR MÉMORIAL FAMILIAL (SAWA PREMIUM)
-- ============================================================

-- 1. Table : hommage (Configuration du site)
CREATE TABLE IF NOT EXISTS hommage (
  id           INT PRIMARY KEY DEFAULT 1,
  nom          TEXT NOT NULL,
  date_naissance TEXT,
  date_deces     TEXT,
  citation     TEXT,
  portrait_url TEXT,
  introduction TEXT,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Insérer une ligne par défaut s'il n'y en a pas
INSERT INTO hommage (id, nom, citation) 
VALUES (1, 'Nom du Défunt', 'Une citation mémorable...')
ON CONFLICT (id) DO NOTHING;

-- 2. Table : biographie (Timeline)
CREATE TABLE IF NOT EXISTS biographie (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  annee        INT NOT NULL,
  titre        TEXT NOT NULL,
  description  TEXT,
  photo_url    TEXT,
  ordre        INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table : messages (Livre d'or)
CREATE TABLE IF NOT EXISTS messages (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auteur      TEXT NOT NULL,
  contenu     TEXT NOT NULL,
  approuve    BOOLEAN DEFAULT FALSE,
  is_family   BOOLEAN DEFAULT FALSE,
  reactions   JSONB DEFAULT '{"coeur": 0, "bougie": 0, "fleur": 0}'::jsonb,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table : medias (Galerie)
CREATE TABLE IF NOT EXISTS medias (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type         TEXT CHECK (type IN ('photo', 'video')) NOT NULL,
  url          TEXT NOT NULL,
  legende      TEXT,
  uploaded_by  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RLS POLICIES (Row Level Security)
-- ============================================================

ALTER TABLE hommage ENABLE ROW LEVEL SECURITY;
ALTER TABLE biographie ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE medias ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour tout
CREATE POLICY "Lecture publique" ON hommage FOR SELECT USING (true);
CREATE POLICY "Lecture publique" ON biographie FOR SELECT USING (true);
CREATE POLICY "Lecture publique" ON messages FOR SELECT USING (true);
CREATE POLICY "Lecture publique" ON medias FOR SELECT USING (true);

-- Écriture restreinte (Admin/Service Role uniquement via dashboard)
-- Note: Pour le livre d'or, le middleware gérera l'insertion approuvée ou non.
CREATE POLICY "Admin insertion messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin modification hommage" ON hommage FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD biographie" ON biographie FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD medias" ON medias FOR ALL USING (auth.role() = 'authenticated');

-- Table des paramètres système
CREATE TABLE  IF NOT EXISTS settings (
    id integer PRIMARY KEY DEFAULT 1,
    site_title text DEFAULT 'Mémorial Familial',
    show_biographie boolean DEFAULT true,
    show_galerie boolean DEFAULT true,
    show_livredor boolean DEFAULT true,
    show_commemorations boolean DEFAULT true,
    show_celebres boolean DEFAULT true,
    show_arbre boolean DEFAULT true,
    show_contact boolean DEFAULT true,
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT one_row CHECK (id = 1) -- Garantit qu'il n'y a qu'une seule configuration
);

-- RLS pour settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique pour settings" ON settings FOR SELECT USING (true);

-- Insertion de la configuration par défaut
INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
