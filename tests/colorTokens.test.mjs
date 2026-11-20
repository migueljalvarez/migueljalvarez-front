import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const walk = dir =>
  readdirSync(dir).flatMap(name => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })

test('no hay colores hex sueltos en los componentes públicos (se usan tokens)', () => {
  const files = ['components', 'pages', 'layouts']
    .flatMap(walk)
    .filter(f => f.endsWith('.vue') && !f.includes('admin'))
  const offenders = files.filter(f => /#[0-9a-fA-F]{6}\b/.test(readFileSync(f, 'utf8')))
  assert.deepEqual(offenders, [])
})

test('los logos de AppLogo existen en public/', () => {
  const source = readFileSync('components/atoms/AppLogo/AppLogo.vue', 'utf8')
  const paths = [...source.matchAll(/'(\/[a-z0-9_-]+\.svg)'/g)].map(m => m[1])
  assert.equal(paths.length, 2)
  for (const p of paths) assert.ok(existsSync(join('public', p)), `falta public${p}`)
})

test('los tokens semánticos y el azul del logo están definidos', () => {
  const css = readFileSync('assets/css/main.css', 'utf8')
  for (const token of [
    'logo-blue: #3f6bad',
    'tint: #eef3fa',
    'surface:',
    'surface-alt:',
    'surface-inverse:',
    'text-muted:',
    'brand:',
    'wa:'
  ]) {
    assert.ok(css.includes(`--color-${token}`), `falta --color-${token}`)
  }
})
