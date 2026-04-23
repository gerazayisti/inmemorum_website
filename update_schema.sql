-- Exécutez ceci dans le SQL Editor de Supabase pour mettre à jour la table hommage

-- 1. Ajout de la colonne pour le Faire-Part (Texte long)
ALTER TABLE hommage ADD COLUMN IF NOT EXISTS faire_part TEXT;

-- 2. Ajout de la colonne pour les groupes de défunts et familles (JSON pour plus de flexibilité)
ALTER TABLE hommage ADD COLUMN IF NOT EXISTS defunts_familles JSONB;

-- 3. Table des personnes célébrées
CREATE TABLE IF NOT EXISTS personnes_celebrees (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  lien_parente TEXT,             -- Ex: "Patriarche", "Épouse", "Fils", "Fille"...
  date_naissance TEXT,
  date_deces TEXT,
  description TEXT,
  photo_url TEXT,
  is_principal BOOLEAN DEFAULT FALSE,  -- La personne icône (vue principale)
  ordre INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table de l'Agenda (Commemorations)
CREATE TABLE IF NOT EXISTS commemorations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT,
  recurrent BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS pour commemorations
ALTER TABLE commemorations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique pour commemorations" ON commemorations FOR SELECT USING (true);
CREATE POLICY "Admin CRUD commemorations" ON commemorations FOR ALL USING (auth.role() = 'authenticated');

-- 5. Table de l'Arbre Généalogique
CREATE TABLE IF NOT EXISTS membres_arbre (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  prenoms TEXT NOT NULL,
  date_naissance TEXT,
  date_deces TEXT,
  photo_url TEXT,
  role TEXT, -- e.g. 'Patriarche', 'Epouse', 'Enfant', 'Petit-enfant'
  parent_id UUID REFERENCES membres_arbre(id), -- Pour relier un enfant à son parent
  conjoint_id UUID REFERENCES membres_arbre(id), -- Pour relier une épouse à son mari
  ordre INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE membres_arbre ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique pour membres_arbre" ON membres_arbre FOR SELECT USING (true);
CREATE POLICY "Admin CRUD membres_arbre" ON membres_arbre FOR ALL USING (auth.role() = 'authenticated');

-- 6. Table des Contacts Famille
CREATE TABLE IF NOT EXISTS contacts_famille (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  role TEXT NOT NULL, -- e.g. 'Représentant', 'Patriarche'
  telephone TEXT,
  email TEXT,
  adresse TEXT,
  photo_url TEXT,
  ordre INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contacts_famille ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique pour contacts_famille" ON contacts_famille FOR SELECT USING (true);
CREATE POLICY "Admin CRUD contacts_famille" ON contacts_famille FOR ALL USING (auth.role() = 'authenticated');

-- 7. Notification explicite à Supabase de recharger son cache
NOTIFY pgrst, 'reload schema';
