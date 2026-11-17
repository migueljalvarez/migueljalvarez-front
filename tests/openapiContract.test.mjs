import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import test from 'node:test'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const apiDir = join(root, 'server', 'api')

const walk = dir =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })

// server/api/(grupo)/ruta.get.ts -> /api/ruta ; index -> raíz de la carpeta ; [id] -> {id}
const toRoute = file => {
  const parts = relative(apiDir, file)
    .split(sep)
    .filter(part => !/^\(.*\)$/.test(part))
    .map(part => part.replace(/\.(get|post|put|patch|delete)\.ts$/, '').replace(/\.ts$/, ''))
    .filter(part => part !== 'index')
    .map(part => part.replace(/^\[(.+)\]$/, '{$1}'))
  return `/api/${parts.join('/')}`
}

test('todos los endpoints de server/api están documentados en docs/openapi.yaml', () => {
  const spec = readFileSync(join(root, 'docs', 'openapi.yaml'), 'utf8')
  const documented = new Set([...spec.matchAll(/^ {2}(\/[^\s:]+):\s*$/gm)].map(match => match[1]))
  const missing = walk(apiDir)
    .map(toRoute)
    .filter(route => !documented.has(route))

  assert.deepEqual(missing, [])
})

test('docs/openapi.yaml no documenta rutas /api inexistentes', () => {
  const spec = readFileSync(join(root, 'docs', 'openapi.yaml'), 'utf8')
  const documented = [...spec.matchAll(/^ {2}(\/api\/[^\s:]+):\s*$/gm)].map(match => match[1])
  const existing = new Set(walk(apiDir).map(toRoute))

  assert.deepEqual(
    documented.filter(route => !existing.has(route)),
    []
  )
})
