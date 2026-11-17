-- 0004_cv.sql — Base de hechos del CV (PRIVADA). Solo estructura: los datos reales viven en
-- .private/seed/ (fuera de git, el repositorio es público) y se cargan con `npm run db:seed`.
-- El generador de CV por vacante solo selecciona y ordena estos hechos; no inventa nada.

-- Perfil profesional (una sola fila).
CREATE TABLE profile (
  id            boolean PRIMARY KEY DEFAULT true CHECK (id),
  full_name     text NOT NULL CHECK (char_length(full_name) BETWEEN 1 AND 150),
  headline      text NOT NULL DEFAULT '' CHECK (char_length(headline) <= 150),
  summary       text NOT NULL DEFAULT '' CHECK (char_length(summary) <= 3000),
  location      text NOT NULL DEFAULT '' CHECK (char_length(location) <= 120),
  email         text NOT NULL DEFAULT '' CHECK (email = '' OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone         text NOT NULL DEFAULT '' CHECK (char_length(phone) <= 30),
  linkedin_url  text NOT NULL DEFAULT '' CHECK (char_length(linkedin_url) <= 200),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER profile_updated BEFORE UPDATE ON profile FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Experiencia: tipo y lugar. `achievements` guarda un logro por línea.
ALTER TABLE experiences
  ADD COLUMN kind text NOT NULL DEFAULT 'empleo' CHECK (kind IN ('empleo', 'freelance', 'proyecto-personal')),
  ADD COLUMN location text NOT NULL DEFAULT '' CHECK (char_length(location) <= 120);

CREATE TABLE skills (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category    text NOT NULL CHECK (char_length(category) BETWEEN 1 AND 80),
  name        text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  sort_order  integer NOT NULL DEFAULT 0,
  UNIQUE (category, name)
);

CREATE TABLE education (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution  text NOT NULL CHECK (char_length(institution) BETWEEN 1 AND 150),
  title        text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 150),
  year         integer CHECK (year BETWEEN 1950 AND 2100)
);

CREATE TABLE certifications (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name    text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
  issuer  text NOT NULL DEFAULT '' CHECK (char_length(issuer) <= 120),
  year    integer CHECK (year BETWEEN 1950 AND 2100),
  detail  text NOT NULL DEFAULT '' CHECK (char_length(detail) <= 200)
);

CREATE TABLE languages (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name    text NOT NULL UNIQUE CHECK (char_length(name) BETWEEN 1 AND 60),
  level   text NOT NULL CHECK (char_length(level) BETWEEN 1 AND 200)
);
