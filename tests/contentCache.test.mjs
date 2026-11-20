import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('la caché del contenido público no usa stale-while-revalidate (en serverless no es fiable)', () => {
  const source = readFileSync('server/utils/publicContentHandler.ts', 'utf8')
  assert.match(source, /swr:\s*false/)
  assert.doesNotMatch(source, /swr:\s*true/)
  assert.match(source, /maxAge:\s*60/)
})

test('la home no usa swr de Nitro y el CDN tiene un tope de copia vencida', () => {
  const config = readFileSync('nuxt.config.ts', 'utf8')
  assert.doesNotMatch(config, /'\/':\s*\{\s*swr/)
  const cdn = config.match(/'Cache-Control':\s*'(public, max-age=0, s-maxage=\d+[^']*)'/)
  assert.ok(cdn, 'falta la cabecera Cache-Control con s-maxage para la home')
  const swr = cdn[1].match(/stale-while-revalidate=(\d+)/)
  assert.ok(swr, 'stale-while-revalidate debe llevar un número de segundos')
  assert.ok(Number(swr[1]) <= 300, 'el tope de copia vencida debe ser de pocos minutos')
})
