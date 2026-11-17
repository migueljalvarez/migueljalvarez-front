-- 0005_public_content.sql — Contenido que se gestiona en el panel y se muestra en el landing.
--
-- Principio: lo público y lo privado viven separados. `projects` (cliente, tarifa, horas) es privado;
-- `portfolio_entries` es solo contenido público. La API pública lee ÚNICAMENTE las vistas `public_*`,
-- que listan columnas permitidas: un campo privado no puede filtrarse por un descuido.

-- Redes sociales (hero, contacto y pie).
CREATE TABLE social_links (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE CHECK (char_length(name) BETWEEN 1 AND 60),
  url         text NOT NULL CHECK (url ~* '^(https://|mailto:)'),
  icon        text NOT NULL CHECK (icon ~ '^[a-z0-9-]+:[a-z0-9-]+$'),
  visible     boolean NOT NULL DEFAULT true,
  sort_order  integer NOT NULL DEFAULT 0,
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER social_links_updated BEFORE UPDATE ON social_links FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Portafolio público. Solo productos propios y trabajos reales de clientes (sin proyectos de práctica).
CREATE TABLE portfolio_entries (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Vínculo opcional con el proyecto privado; los productos propios no lo necesitan.
  project_id    uuid UNIQUE REFERENCES projects (id) ON DELETE SET NULL,
  slug          text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND char_length(slug) <= 80),
  title         text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  kind          text NOT NULL CHECK (kind IN ('client', 'product')),
  status        text NOT NULL DEFAULT 'in-development' CHECK (status IN ('published', 'in-development')),
  description   text NOT NULL CHECK (char_length(description) BETWEEN 1 AND 400),
  role          text NOT NULL DEFAULT '' CHECK (char_length(role) <= 120),
  year          text NOT NULL DEFAULT '' CHECK (char_length(year) <= 20),
  duration      text NOT NULL DEFAULT '' CHECK (char_length(duration) <= 60),
  problem       text NOT NULL DEFAULT '' CHECK (char_length(problem) <= 1500),
  decision      text NOT NULL DEFAULT '' CHECK (char_length(decision) <= 1500),
  result        text NOT NULL DEFAULT '' CHECK (char_length(result) <= 1500),
  -- [{ "value": "…", "label": "…" }], solo cifras verificables.
  highlights    jsonb NOT NULL DEFAULT '[]' CHECK (jsonb_typeof(highlights) = 'array'),
  scope         text[] NOT NULL DEFAULT '{}',
  technologies  text[] NOT NULL DEFAULT '{}',
  -- Rutas dentro de public/projects/<slug>/ (medidas en docs/portfolio-guide.md).
  cover_path    text NOT NULL DEFAULT '',
  og_path       text NOT NULL DEFAULT '',
  url           text NOT NULL DEFAULT '' CHECK (url = '' OR url ~* '^https://'),
  featured      boolean NOT NULL DEFAULT false,
  sort_order    integer NOT NULL DEFAULT 0,
  -- Interruptor de publicación: nada es visible hasta activarlo.
  is_published  boolean NOT NULL DEFAULT false,
  published_at  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT portfolio_publish_requires_cover CHECK (NOT is_published OR cover_path <> '')
);
CREATE INDEX portfolio_entries_public_idx ON portfolio_entries (sort_order) WHERE is_published;
CREATE TRIGGER portfolio_entries_updated BEFORE UPDATE ON portfolio_entries FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE portfolio_media (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id    uuid NOT NULL REFERENCES portfolio_entries (id) ON DELETE CASCADE,
  path        text NOT NULL CHECK (char_length(path) BETWEEN 1 AND 300),
  -- El texto alternativo es obligatorio (accesibilidad y SEO).
  alt         text NOT NULL CHECK (char_length(alt) BETWEEN 1 AND 200),
  caption     text NOT NULL DEFAULT '' CHECK (char_length(caption) <= 200),
  sort_order  integer NOT NULL DEFAULT 0
);
CREATE INDEX portfolio_media_entry_idx ON portfolio_media (entry_id, sort_order);

-- Máximo 6 imágenes de galería por proyecto (guía del portafolio).
CREATE FUNCTION limit_portfolio_media() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF (SELECT count(*) FROM portfolio_media WHERE entry_id = NEW.entry_id) >= 6 THEN
    RAISE EXCEPTION 'portfolio_media_limit: máximo 6 imágenes por proyecto';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER portfolio_media_limit BEFORE INSERT ON portfolio_media FOR EACH ROW EXECUTE FUNCTION limit_portfolio_media();

-- ---------------------------------------------------------------------------------------------
-- Vistas públicas: lo único que la API pública puede leer.
-- ---------------------------------------------------------------------------------------------
CREATE VIEW public_portfolio AS
SELECT
  e.slug, e.title, e.kind, e.status, e.description, e.role, e.year, e.duration,
  e.problem, e.decision, e.result, e.highlights, e.scope, e.technologies,
  e.cover_path, e.og_path, e.url, e.featured, e.sort_order, e.published_at,
  COALESCE(
    (SELECT jsonb_agg(jsonb_build_object('src', m.path, 'alt', m.alt, 'caption', m.caption) ORDER BY m.sort_order)
     FROM portfolio_media m WHERE m.entry_id = e.id),
    '[]'::jsonb
  ) AS gallery
FROM portfolio_entries e
WHERE e.is_published;

-- Testimonios aprobados (requieren consentimiento de publicación). Nunca se expone el correo ni el token.
CREATE VIEW public_testimonials AS
SELECT
  id, client_name AS author_name, author_role, author_company,
  COALESCE(published_text, answer) AS body,
  photo_path, logo_path, answered_at
FROM testimonial_requests
WHERE status = 'aprobada' AND consent_publish;

CREATE VIEW public_policies AS
SELECT title, body, sort_order FROM policies WHERE is_public;

CREATE VIEW public_social_links AS
SELECT name, url, icon, sort_order FROM social_links WHERE visible;
