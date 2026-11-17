// Carga los datos privados de .private/seed/*.sql (fuera de git) en el Postgres de desarrollo.
// Cada archivo es idempotente (borra y vuelve a insertar sus tablas). Uso: npm run db:seed
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '.private', 'seed')
const CONTAINER = process.env.DB_CONTAINER || 'mjalvarez-db-dev'

if (!existsSync(dir)) {
  console.log('No hay .private/seed/: nada que cargar.')
  process.exit(0)
}

for (const file of readdirSync(dir)
  .filter(f => f.endsWith('.sql'))
  .sort()) {
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
      '-q'
    ],
    { input: readFileSync(join(dir, file), 'utf8'), encoding: 'utf8' }
  )
  console.log(`Cargado: ${file}`)
}
