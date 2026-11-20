import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const config = readFileSync('nuxt.config.ts', 'utf8').replace(/\/\/.*$/gm, '')

test('el CSP restringe todo al propio origen y prohíbe objetos, marcos y bases ajenas', () => {
  for (const directive of [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests'
  ])
    assert.ok(config.includes(`"${directive}"`) || config.includes(`'${directive}'`), directive)
})

test('el CSP no admite scripts ni conexiones de terceros', () => {
  const csp = /'Content-Security-Policy': \[([\s\S]*?)\]\.join/.exec(config)[1]
  assert.doesNotMatch(csp, /script-src[^"]*https:/)
  assert.doesNotMatch(csp, /connect-src[^"]*https?:/)
  assert.doesNotMatch(csp, /'unsafe-eval'/)
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
