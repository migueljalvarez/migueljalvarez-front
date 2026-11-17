import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const OUTPUT_DIR = new URL('../.output', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')

// Títulos de los proyectos de ejemplo (constants/portfolio.mock.ts) que nunca deben llegar a producción.
const MOCK_TITLES = [
  'Tu Radio AR Stereo',
  'Caja de Ritmos',
  'Frases Aleatorias',
  'Agencia Ops',
  'CRM Visual',
  'Intranet Lab',
  // Datos de ejemplo del panel (constants/admin.samples.ts)
  'Ana Ejemplo',
  'Carlos Muestra',
  'Tienda Demo S.A.S.',
  'Diseñadora Ejemplo'
]

// Evita node_modules y enlaces simbólicos de .output (provocan bucles).
const walk = dir =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.isSymbolicLink() || entry.name === 'node_modules') return []
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })

test(
  'los proyectos de ejemplo no se incluyen en el build de producción',
  { skip: !existsSync(OUTPUT_DIR) && 'Ejecuta `npm run build` primero' },
  () => {
    const files = walk(OUTPUT_DIR).filter(file => /\.(m?js|json|html)$/.test(file))
    const leaks = files.flatMap(file => {
      const content = readFileSync(file, 'utf8')
      return MOCK_TITLES.filter(title => content.includes(title)).map(
        title => `${title} en ${file}`
      )
    })

    assert.deepEqual(leaks, [])
  }
)
