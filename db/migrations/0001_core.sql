-- 0001_core.sql — Modelo base del panel: leads, testimonios, clientes, proyectos, equipo, horas, pagos,
-- tarifas, políticas y experiencia.
--
-- Reglas de diseño (ver docs/database.md):
--   * SQL estándar de PostgreSQL (>= 13). Sin extensiones ni funciones propias de Supabase, para poder
--     llevar estas mismas migraciones a cualquier servidor Postgres.
--   * Montos siempre en USD (numeric). La TRM (COP por USD) se guarda en cada pago.
--   * Valores controlados con CHECK sobre text (más fácil de migrar que los tipos ENUM).
--   * Las reglas de negocio mínimas viven también en la base (CHECK/FK), no solo en la interfaz.

-- Actualiza updated_at automáticamente en cada UPDATE.
CREATE FUNCTION set_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------------------------
-- Clientes
-- ---------------------------------------------------------------------------------------------
CREATE TABLE clients (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  email       text NOT NULL DEFAULT '' CHECK (email = '' OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  company     text NOT NULL DEFAULT '' CHECK (char_length(company) <= 120),
  notes       text NOT NULL DEFAULT '' CHECK (char_length(notes) <= 2000),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER clients_updated BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------------------------
-- Leads (posibles clientes) y sus notas
-- ---------------------------------------------------------------------------------------------
CREATE TABLE leads (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email                 text NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone                 text NOT NULL DEFAULT '' CHECK (char_length(phone) <= 30),
  subject               text NOT NULL CHECK (subject IN ('desarrollo', 'oferta', 'consulta', 'soporte', 'otro')),
  origin                text NOT NULL CHECK (origin IN ('formulario', 'whatsapp', 'linkedin', 'referido', 'otro')),
  status                text NOT NULL DEFAULT 'nuevo'
                        CHECK (status IN ('nuevo', 'contactado', 'reunion', 'propuesta', 'ganado', 'perdido')),
  message               text NOT NULL DEFAULT '' CHECK (char_length(message) <= 5000),
  lost_reason           text NOT NULL DEFAULT '' CHECK (char_length(lost_reason) <= 500),
  next_action           text NOT NULL DEFAULT '' CHECK (char_length(next_action) <= 200),
  next_action_date      date,
  -- Consentimiento de tratamiento de datos (Ley 1581): cuándo y con qué versión de la política.
  consent_at            timestamptz,
  consent_policy_version text,
  -- Cliente al que se convirtió el lead (cuando se gana).
  client_id             uuid REFERENCES clients (id) ON DELETE SET NULL,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT lead_lost_requires_reason CHECK (status <> 'perdido' OR lost_reason <> '')
);
CREATE INDEX leads_status_idx ON leads (status);
CREATE INDEX leads_created_idx ON leads (created_at DESC);
CREATE INDEX leads_email_idx ON leads (lower(email));
CREATE INDEX leads_next_action_idx ON leads (next_action_date) WHERE next_action_date IS NOT NULL;
CREATE TRIGGER leads_updated BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE lead_notes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     uuid NOT NULL REFERENCES leads (id) ON DELETE CASCADE,
  body        text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX lead_notes_lead_idx ON lead_notes (lead_id, created_at DESC);

-- ---------------------------------------------------------------------------------------------
-- Testimonios (solicitud por enlace único + aprobación)
-- ---------------------------------------------------------------------------------------------
CREATE TABLE testimonial_requests (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       uuid REFERENCES clients (id) ON DELETE SET NULL,
  client_name     text NOT NULL CHECK (char_length(client_name) BETWEEN 1 AND 100),
  email           text NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  project_name    text NOT NULL DEFAULT '' CHECK (char_length(project_name) <= 150),
  message         text NOT NULL DEFAULT '' CHECK (char_length(message) <= 1000),
  -- Solo se guarda el hash (sha-256 en hex) del token del enlace; el token real va en el correo.
  token_hash      text NOT NULL UNIQUE CHECK (token_hash ~ '^[0-9a-f]{64}$'),
  status          text NOT NULL DEFAULT 'enviada'
                  CHECK (status IN ('enviada', 'abierta', 'respondida', 'aprobada', 'rechazada', 'expirada')),
  expires_at      timestamptz NOT NULL,
  sent_at         timestamptz NOT NULL DEFAULT now(),
  opened_at       timestamptz,
  answered_at     timestamptz,
  -- Texto original del cliente: nunca se modifica. Si se edita para publicar, va en published_text.
  answer          text CHECK (answer IS NULL OR char_length(answer) BETWEEN 1 AND 3000),
  published_text  text CHECK (published_text IS NULL OR char_length(published_text) BETWEEN 1 AND 3000),
  author_role     text NOT NULL DEFAULT '' CHECK (char_length(author_role) <= 120),
  author_company  text NOT NULL DEFAULT '' CHECK (char_length(author_company) <= 120),
  photo_path      text,
  logo_path       text,
  -- El cliente debe aceptar el uso público de su texto, foto y logo.
  consent_publish boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT testimonial_answer_required CHECK (status NOT IN ('respondida', 'aprobada') OR answer IS NOT NULL),
  CONSTRAINT testimonial_publish_requires_consent CHECK (status <> 'aprobada' OR consent_publish)
);
CREATE INDEX testimonial_requests_status_idx ON testimonial_requests (status);
CREATE TRIGGER testimonial_requests_updated BEFORE UPDATE ON testimonial_requests FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------------------------
-- Proyectos
-- ---------------------------------------------------------------------------------------------
CREATE TABLE projects (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     uuid NOT NULL REFERENCES clients (id) ON DELETE RESTRICT,
  name          text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 150),
  status        text NOT NULL DEFAULT 'planificado'
                CHECK (status IN ('planificado', 'en-curso', 'pausado', 'entregado')),
  rate_usd      numeric(10, 2) NOT NULL CHECK (rate_usd > 0),
  budget_hours  numeric(8, 2) NOT NULL CHECK (budget_hours > 0),
  start_date    date NOT NULL,
  deadline      date NOT NULL,
  publishable   boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT project_deadline_after_start CHECK (deadline >= start_date)
);
CREATE INDEX projects_client_idx ON projects (client_id);
CREATE INDEX projects_status_deadline_idx ON projects (status, deadline);
CREATE TRIGGER projects_updated BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------------------------
-- Equipo, asignaciones, horas y pagos
-- ---------------------------------------------------------------------------------------------
CREATE TABLE team_members (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email             text NOT NULL DEFAULT '' CHECK (email = '' OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  role              text NOT NULL CHECK (char_length(role) BETWEEN 1 AND 100),
  responsibilities  text NOT NULL DEFAULT '' CHECK (char_length(responsibilities) <= 1000),
  rate_usd          numeric(10, 2) NOT NULL CHECK (rate_usd > 0),
  active            boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER team_members_updated BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE assignments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id     uuid NOT NULL REFERENCES team_members (id) ON DELETE CASCADE,
  project_id    uuid NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  agreed_hours  numeric(8, 2) NOT NULL CHECK (agreed_hours > 0),
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (member_id, project_id)
);

CREATE TABLE time_entries (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id   uuid NOT NULL REFERENCES team_members (id) ON DELETE RESTRICT,
  project_id  uuid NOT NULL REFERENCES projects (id) ON DELETE RESTRICT,
  hours       numeric(5, 2) NOT NULL CHECK (hours > 0 AND hours <= 24),
  work_date   date NOT NULL,
  note        text NOT NULL DEFAULT '' CHECK (char_length(note) <= 300),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX time_entries_member_idx ON time_entries (member_id, work_date DESC);
CREATE INDEX time_entries_project_idx ON time_entries (project_id);

-- TRM oficial por día (COP por 1 USD). Se llena con el servicio de TRM; respaldo histórico.
CREATE TABLE trm_rates (
  rate_date    date PRIMARY KEY,
  cop_per_usd  numeric(10, 2) NOT NULL CHECK (cop_per_usd > 0),
  source       text NOT NULL DEFAULT 'manual'
);

CREATE TABLE payments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id   uuid NOT NULL REFERENCES team_members (id) ON DELETE RESTRICT,
  amount_usd  numeric(12, 2) NOT NULL CHECK (amount_usd > 0),
  -- TRM aplicada el día del pago (COP por USD), guardada en la propia transacción.
  trm         numeric(10, 2) NOT NULL CHECK (trm > 0),
  amount_cop  numeric(16, 0) GENERATED ALWAYS AS (round(amount_usd * trm)) STORED,
  paid_on     date NOT NULL,
  note        text NOT NULL DEFAULT '' CHECK (char_length(note) <= 300),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX payments_member_idx ON payments (member_id, paid_on DESC);

-- ---------------------------------------------------------------------------------------------
-- Tarifas, políticas y experiencia
-- ---------------------------------------------------------------------------------------------
CREATE TABLE rates (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service     text NOT NULL CHECK (char_length(service) BETWEEN 1 AND 120),
  rate_usd    numeric(10, 2) NOT NULL CHECK (rate_usd > 0),
  is_public   boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER rates_updated BEFORE UPDATE ON rates FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE policies (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  body        text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  is_public   boolean NOT NULL DEFAULT true,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER policies_updated BEFORE UPDATE ON policies FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Experiencia profesional: fuente de verdad PRIVADA (nunca pública) para generar CV sin inventar datos.
CREATE TABLE experiences (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company       text NOT NULL CHECK (char_length(company) BETWEEN 1 AND 120),
  role          text NOT NULL CHECK (char_length(role) BETWEEN 1 AND 120),
  start_date    date NOT NULL,
  end_date      date,
  is_current    boolean NOT NULL DEFAULT false,
  achievements  text NOT NULL CHECK (char_length(achievements) BETWEEN 1 AND 3000),
  technologies  text[] NOT NULL DEFAULT '{}',
  evidence      text NOT NULL DEFAULT '' CHECK (char_length(evidence) <= 500),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT experience_end_or_current CHECK (is_current OR end_date IS NOT NULL),
  CONSTRAINT experience_end_after_start CHECK (end_date IS NULL OR end_date >= start_date)
);
CREATE TRIGGER experiences_updated BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION set_updated_at();
