// Ejecuta las migraciones de db/migrations en orden, una sola vez cada una.
// Sin dependencias: usa psql dentro del contenedor de desarrollo (docker-compose.dev.yml).
// Uso: node db/migrate.mjs [--reset]   (--reset borra todo el esquema; solo desarrollo)
import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = join(dirname(fileURLToPath(import.meta.url)), 'migrations')
const CONTAINER = process.env.DB_CONTAINER || 'mjalvarez-db-dev'

const psql = (sql, { input } = {}) =>
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
      '-tA',
      ...(input ? [] : ['-c', sql])
    ],
    { input, encoding: 'utf8' }
  )

if (process.argv.includes('--reset')) {
  psql('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
  console.log('Esquema reiniciado.')
}

psql(
  'CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())'
)
const applied = new Set(psql('SELECT name FROM schema_migrations').split('\n').filter(Boolean))

for (const file of readdirSync(dir)
  .filter(f => f.endsWith('.sql'))
  .sort()) {
  if (applied.has(file)) continue
  const sql = readFileSync(join(dir, file), 'utf8')
  psql('', {
    input: `BEGIN;\n${sql}\nINSERT INTO schema_migrations (name) VALUES ('${file}');\nCOMMIT;\n`
  })
  console.log(`Aplicada: ${file}`)
}
console.log('Migraciones al día.')
