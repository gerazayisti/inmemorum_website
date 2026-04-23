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

-- 5. Notification explicite à Supabase de recharger son cache
NOTIFY pgrst, 'reload schema';
