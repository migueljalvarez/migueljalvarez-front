import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('la caché del contenido público no usa stale-while-revalidate (en serverless no es fiable)', () => {
  const source = readFileSync('server/utils/publicContentHandler.ts', 'utf8')
  assert.match(source, /swr:\s*false/)
  assert.doesNotMatch(source, /swr:\s*true/)
  assert.match(source, /maxAge:\s*60/)
})

test('la home no se cachea en Nitro ni en el CDN (la frescura la fija el contenido, 60 s)', () => {
  const config = readFileSync('nuxt.config.ts', 'utf8')
  assert.doesNotMatch(config, /'\/':\s*\{\s*swr/)
  // Ninguna regla de caché compartida para la home: sin s-maxage ni stale-while-revalidate en la configuración.
  const code = config.replace(/\/\/.*$/gm, '')
  assert.doesNotMatch(code, /s-maxage|stale-while-revalidate|Netlify-CDN-Cache-Control/)
  assert.match(code, /'Cache-Control':\s*'public, max-age=0, must-revalidate'/)
})
