// Prueba el esquema SQL contra el Postgres de desarrollo (docker-compose.dev.yml).
// Se omite si el contenedor no está levantado. Cada caso corre en una transacción que se revierte.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'

const CONTAINER = 'mjalvarez-db-dev'

const run = sql =>
  execFileSync(
    'docker',
    [
      'exec',
      '-i',
      CONTAINER,
      'psql',
      '-U',
      'dev',
      '-d',
      'migueljalvarez',
      '-v',
      'ON_ERROR_STOP=1',
      '-tA'
    ],
    {
      input: sql,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    }
  )

let available = false
try {
  available =
    execFileSync('docker', ['inspect', '-f', '{{.State.Running}}', CONTAINER], {
      encoding: 'utf8',
      stdio: 'pipe'
    }).trim() === 'true'
  if (available)
    available = run("SELECT to_regclass('public.member_balances') IS NOT NULL;").trim() === 't'
} catch {
  available = false
}
const opts = {
  skip: available
    ? false
    : 'Postgres de desarrollo no disponible (npm run db:up && npm run db:migrate)'
}

const rejects = (sql, pattern) =>
  assert.throws(
    () => run(`BEGIN;\n${sql}\nROLLBACK;`),
    e => pattern.test(String(e.stderr))
  )

const client =
  "INSERT INTO clients (id, name) VALUES ('00000000-0000-0000-0000-000000000001', 'Cliente');"

test('lead perdido exige motivo', opts, () => {
  rejects(
    "INSERT INTO leads (name, email, subject, origin, status) VALUES ('A', 'a@b.co', 'otro', 'otro', 'perdido');",
    /lead_lost_requires_reason/
  )
})

test('lead rechaza correo inválido y estado desconocido', opts, () => {
  rejects(
    "INSERT INTO leads (name, email, subject, origin) VALUES ('A', 'no-es-correo', 'otro', 'otro');",
    /leads_email_check/
  )
  rejects(
    "INSERT INTO leads (name, email, subject, origin, status) VALUES ('A', 'a@b.co', 'otro', 'otro', 'x');",
    /leads_status_check/
  )
})

test('proyecto: deadline no puede ser anterior al inicio', opts, () => {
  rejects(
    `${client}\nINSERT INTO projects (client_id, name, rate_usd, budget_hours, start_date, deadline) VALUES ('00000000-0000-0000-0000-000000000001', 'P', 20, 10, '2026-02-01', '2026-01-01');`,
    /project_deadline_after_start/
  )
})

test('horas: máximo 24 por registro', opts, () => {
  rejects(
    `${client}
INSERT INTO team_members (id, name, role, rate_usd) VALUES ('00000000-0000-0000-0000-000000000002', 'M', 'dev', 10);
INSERT INTO projects (id, client_id, name, rate_usd, budget_hours, start_date, deadline) VALUES ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'P', 20, 10, '2026-01-01', '2026-02-01');
INSERT INTO time_entries (member_id, project_id, hours, work_date) VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 25, '2026-01-02');`,
    /time_entries_hours_check/
  )
})

test('testimonio aprobado exige consentimiento y respuesta', opts, () => {
  const hash = 'a'.repeat(64)
  rejects(
    `INSERT INTO testimonial_requests (client_name, email, token_hash, status, expires_at, answer, consent_publish) VALUES ('C', 'c@d.co', '${hash}', 'aprobada', now() + interval '7 days', 'Excelente', false);`,
    /testimonial_publish_requires_consent/
  )
})

test('experiencia: sin fin ni "actual" es inválida', opts, () => {
  rejects(
    "INSERT INTO experiences (company, role, start_date, achievements) VALUES ('X', 'Y', '2020-01-01', 'logros');",
    /experience_end_or_current/
  )
})

test('vista member_balances: horas × tarifa − pagos, sin saldo negativo', opts, () => {
  const out = run(`BEGIN;
${client}
INSERT INTO team_members (id, name, role, rate_usd) VALUES ('00000000-0000-0000-0000-000000000002', 'M', 'dev', 10);
INSERT INTO projects (id, client_id, name, rate_usd, budget_hours, start_date, deadline) VALUES ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'P', 20, 10, '2026-01-01', '2026-02-01');
INSERT INTO time_entries (member_id, project_id, hours, work_date) VALUES
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 5, '2026-01-02'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 3.5, '2026-01-03');
INSERT INTO payments (member_id, amount_usd, trm, paid_on) VALUES ('00000000-0000-0000-0000-000000000002', 30, 4000, '2026-01-10');
SELECT hours, earned_usd, paid_usd, due_usd FROM member_balances WHERE member_id = '00000000-0000-0000-0000-000000000002';
SELECT used_hours, used_percent FROM project_hours WHERE project_id = '00000000-0000-0000-0000-000000000003';
SELECT amount_cop FROM payments;
ROLLBACK;`)
  const lines = out.split('\n').filter(l => l.includes('|') || /^\d+$/.test(l))
  assert.equal(lines[0], '8.50|85.00|30.00|55.00')
  assert.equal(lines[1], '8.50|85.0')
  assert.equal(lines[2], '120000')
})

test('perfil admite una sola fila y experiencia valida su tipo', opts, () => {
  rejects(
    "INSERT INTO profile (full_name) VALUES ('A'); INSERT INTO profile (full_name) VALUES ('B');",
    /profile_pkey/
  )
  rejects(
    "INSERT INTO experiences (company, role, start_date, is_current, achievements, kind) VALUES ('X', 'Y', '2020-01-01', true, 'logro', 'otro');",
    /experiences_kind_check/
  )
})

test(
  'portafolio: publicar exige portada y la vista pública oculta lo no publicado y lo privado',
  opts,
  () => {
    rejects(
      "INSERT INTO portfolio_entries (slug, title, kind, description, is_published) VALUES ('x', 'X', 'product', 'd', true);",
      /portfolio_publish_requires_cover/
    )
    const out = run(`BEGIN;
INSERT INTO portfolio_entries (slug, title, kind, description, cover_path, is_published) VALUES ('visible', 'V', 'product', 'd', '/p/v.webp', true);
INSERT INTO portfolio_entries (slug, title, kind, description) VALUES ('borrador', 'B', 'product', 'd');
SELECT count(*) FROM public_portfolio;
SELECT count(*) FROM information_schema.columns WHERE table_name = 'public_portfolio' AND column_name IN ('project_id', 'id', 'is_published');
ROLLBACK;`)
    assert.deepEqual(
      out.split('\n').filter(l => /^\d+$/.test(l)),
      ['1', '0']
    )
  }
)

test('portafolio: máximo 6 imágenes de galería, con alt obligatorio', opts, () => {
  const entry =
    "INSERT INTO portfolio_entries (id, slug, title, kind, description) VALUES ('00000000-0000-0000-0000-0000000000aa', 'g', 'G', 'product', 'd');"
  const media = n =>
    Array.from(
      { length: n },
      (_, i) =>
        `INSERT INTO portfolio_media (entry_id, path, alt) VALUES ('00000000-0000-0000-0000-0000000000aa', '/p/${i}.webp', 'alt ${i}');`
    ).join('\n')
  rejects(`${entry}\n${media(7)}`, /portfolio_media_limit/)
  rejects(
    `${entry}\nINSERT INTO portfolio_media (entry_id, path, alt) VALUES ('00000000-0000-0000-0000-0000000000aa', '/p.webp', '');`,
    /portfolio_media_alt_check/
  )
})

test('testimonios públicos: solo aprobados, sin correo ni token', opts, () => {
  const out = run(`BEGIN;
INSERT INTO testimonial_requests (client_name, email, token_hash, status, expires_at, answer, published_text, consent_publish)
  VALUES ('Ana', 'ana@x.co', '${'b'.repeat(64)}', 'aprobada', now() + interval '7 days', 'original', 'editado', true);
INSERT INTO testimonial_requests (client_name, email, token_hash, status, expires_at, answer)
  VALUES ('Beto', 'beto@x.co', '${'c'.repeat(64)}', 'respondida', now() + interval '7 days', 'pendiente');
SELECT author_name, body FROM public_testimonials;
SELECT count(*) FROM information_schema.columns WHERE table_name = 'public_testimonials' AND column_name IN ('email', 'token_hash', 'answer');
ROLLBACK;`)
  const lines = out.split('\n').filter(l => l.includes('|') || /^\d+$/.test(l))
  assert.deepEqual(lines, ['Ana|editado', '0'])
})

test('redes sociales: solo https o mailto', opts, () => {
  rejects(
    "INSERT INTO social_links (name, url, icon) VALUES ('X', 'http://inseguro.com', 'mdi:web');",
    /social_links_url_check/
  )
})
