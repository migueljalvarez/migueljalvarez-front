import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const config = readFileSync('nuxt.config.ts', 'utf8').replace(/^\s*\/\/.*$/gm, '')
const builder = /const buildCsp = \(connectSrc: string\) =>\s*\[([\s\S]*?)\]\.join/.exec(config)[1]

test('el CSP restringe todo al propio origen y prohíbe objetos, marcos y bases ajenas', () => {
  for (const directive of [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests'
  ])
    assert.ok(builder.includes(directive), directive)
  assert.ok(builder.includes('`connect-src ${connectSrc}`'))
})

test('el CSP no admite scripts de terceros ni eval', () => {
  assert.doesNotMatch(builder, /script-src[^"]*https?:/)
  assert.doesNotMatch(builder, /'unsafe-eval'/)
})

test('el sitio público solo conecta a su origen; el panel y el acceso admiten además la API de iconos', () => {
  assert.match(config, /\? buildCsp\("'self'"\)/)
  assert.match(config, /buildCsp\("'self' https:\/\/\*\.iconify\.design"\)/)
  assert.match(config, /'Content-Security-Policy': CONTENT_SECURITY_POLICY/)
  // El panel y el acceso comparten CSP (la sesión navega de uno a otro sin recargar).
  assert.equal((config.match(/'Content-Security-Policy': ADMIN_CONTENT_SECURITY_POLICY/g) || []).length, 2)
})

test('el CSP estricto solo rige en producción (en desarrollo Nuxt Icon y Vite necesitan más)', () => {
  assert.match(config, /IS_PRODUCTION\s*\? buildCsp/)
  assert.match(config, /: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'"/)
})

test('siguen las demás cabeceras de seguridad', () => {
  for (const header of [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Referrer-Policy',
    'Permissions-Policy',
    'Strict-Transport-Security'
  ])
    assert.ok(config.includes(header), header)
})
