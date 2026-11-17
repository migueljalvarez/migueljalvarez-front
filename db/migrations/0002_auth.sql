-- 0002_auth.sql — Acceso al panel con autenticación propia (reemplaza la sesión provisional).
--
-- Contraseñas: solo el hash (argon2id o bcrypt), generado por la API. Sesiones: se guarda el hash
-- del token de la cookie, con vencimiento y posibilidad de revocar. Intentos fallidos en la base
-- para que el límite se comparta entre instancias.

CREATE TABLE admin_users (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email          text NOT NULL UNIQUE CHECK (email = lower(email) AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  password_hash  text NOT NULL CHECK (char_length(password_hash) >= 20),
  active         boolean NOT NULL DEFAULT true,
  last_login_at  timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER admin_users_updated BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE admin_sessions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES admin_users (id) ON DELETE CASCADE,
  token_hash   text NOT NULL UNIQUE CHECK (token_hash ~ '^[0-9a-f]{64}$'),
  expires_at   timestamptz NOT NULL,
  revoked_at   timestamptz,
  user_agent   text NOT NULL DEFAULT '',
  created_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT session_expires_after_creation CHECK (expires_at > created_at)
);
CREATE INDEX admin_sessions_user_idx ON admin_sessions (user_id);
CREATE INDEX admin_sessions_active_idx ON admin_sessions (expires_at) WHERE revoked_at IS NULL;

-- Intentos de acceso (para límites compartidos y auditoría). La IP se guarda como hash.
CREATE TABLE login_attempts (
  id          bigserial PRIMARY KEY,
  email       text NOT NULL DEFAULT '',
  ip_hash     text NOT NULL,
  succeeded   boolean NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX login_attempts_ip_idx ON login_attempts (ip_hash, created_at DESC);
