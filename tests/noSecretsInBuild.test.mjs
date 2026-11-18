import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const outputDir = join(root, '.output')
const envFile = join(root, '.env')

// Variables privadas que nunca deben quedar escritas dentro del build.
const SECRET_KEYS = [
  'INTAKE_API_KEY',
  'API_ACCESS_CLIENT_SECRET',
  'RESEND_API_KEY',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL'
]

const walk = dir =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.isSymbolicLink() || entry.name === 'node_modules') return []
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })

const readEnv = () =>
  Object.fromEntries(
    readFileSync(envFile, 'utf8')
      .split(/\r?\n/)
      .map(line => line.match(/^([A-Z0-9_]+)=(.*)$/))
      .filter(Boolean)
      .map(match => [match[1], match[2].replace(/^["']|["']$/g, '').slice(0, 40)])
  )

test(
  'los secretos del .env no quedan escritos en el build de producción',
  { skip: (!existsSync(outputDir) || !existsSync(envFile)) && 'Requiere .env y `npm run build`' },
  () => {
    const env = readEnv()
    const files = walk(outputDir).filter(file => /\.(m?js|json|html|cjs)$/.test(file))
    const contents = files.map(file => readFileSync(file, 'utf8'))

    // Solo se informan nombres de variables, nunca sus valores.
    const leaked = SECRET_KEYS.filter(
      key => env[key] && contents.some(content => content.includes(env[key]))
    )

    assert.deepEqual(leaked, [])
  }
)
