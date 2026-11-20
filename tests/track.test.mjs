import assert from 'node:assert/strict'
import test from 'node:test'
import { createRateLimiter } from '../server/utils/rateLimit.ts'
import {
  forwardTrack,
  hashIp,
  isKnownBot,
  MAX_TRACK_BODY_BYTES,
  parseTrackBody,
  TRACK_BUTTON_IDS,
  TRACK_EVENT_IDS,
  TRACK_RATE
} from '../server/utils/track.ts'

const base = { eventId: 'wa_hero', pagePath: '/', device: 'desktop' }
const parse = body => parseTrackBody(JSON.stringify(body))

test('acepta cada ID de la lista cerrada (con slug solo en los de proyecto)', () => {
  assert.equal(TRACK_EVENT_IDS.length, 11)
  for (const eventId of TRACK_EVENT_IDS) {
    const withSlug = eventId === 'wa_proyecto' || eventId === 'cta_ver_proyecto'
    const value = parse({ ...base, eventId, ...(withSlug ? { slug: 'mi-comodoro' } : {}) })
    assert.equal(value?.eventId, eventId)
  }
  assert.ok(TRACK_BUTTON_IDS.includes('wa_contacto_compacto') && TRACK_BUTTON_IDS.includes('cta_hero_card'))
})

test('rechaza IDs desconocidos y slugs faltantes, sobrantes o mal formados', () => {
  assert.equal(parse({ ...base, eventId: 'otro' }), null)
  assert.equal(parse({ ...base, eventId: 'wa_proyecto' }), null)
  assert.equal(parse({ ...base, eventId: 'cta_ver_proyecto', slug: 'Mal Slug' }), null)
  assert.equal(parse({ ...base, slug: 'mi-comodoro' }), null)
  assert.equal(parse({ ...base, eventId: 'wa_proyecto', slug: 'a'.repeat(81) }), null)
})

test('rechaza campos extra y tipos raros', () => {
  assert.equal(parse({ ...base, ip: '1.2.3.4' }), null)
  assert.equal(parse({ ...base, userAgent: 'x' }), null)
  assert.equal(parse({ ...base, device: 5 }), null)
  assert.equal(parse({ ...base, eventId: ['wa_hero'] }), null)
  assert.equal(parse([base]), null)
  assert.equal(parse(null), null)
  assert.equal(parseTrackBody('{no es json'), null)
  assert.equal(parseTrackBody(''), null)
})

test('valida ruta, utm, referrer y dispositivo', () => {
  assert.equal(parse({ ...base, pagePath: 'sin-barra' }), null)
  assert.equal(parse({ ...base, pagePath: '/portafolio?x=1' }), null)
  assert.equal(parse({ ...base, pagePath: '/a#b' }), null)
  assert.equal(parse({ ...base, pagePath: `/${'a'.repeat(200)}` }), null)
  assert.equal(parse({ ...base, device: 'tablet' }), null)
  assert.equal(parse({ ...base, utmSource: '<script>' }), null)
  assert.equal(parse({ ...base, utmCampaign: 'x'.repeat(61) }), null)
  assert.equal(parse({ ...base, referrerHost: 'https://google.com/a' }), null)
  const ok = parse({
    ...base,
    pagePath: '/portafolio/mi-comodoro',
    utmSource: 'linkedin',
    utmCampaign: 'lanzamiento 1',
    referrerHost: 'www.google.com'
  })
  assert.equal(ok?.referrerHost, 'www.google.com')
})

test('el cuerpo no puede superar 1 KB', () => {
  const big =
    JSON.stringify({ ...base, utmSource: 'a'.repeat(60) }) + ' '.repeat(MAX_TRACK_BODY_BYTES)
  assert.equal(parseTrackBody(big), null)
})

test('detecta bots por user agent y trata la ausencia como bot', () => {
  for (const ua of [
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/120.0 Safari/537.36',
    'curl/8.4.0',
    'python-requests/2.31',
    'Mozilla/5.0 (compatible; bingbot/2.0)',
    'Lighthouse',
    undefined,
    ''
  ]) {
    assert.equal(isKnownBot(ua), true, String(ua))
  }
  for (const ua of [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
  ]) {
    assert.equal(isKnownBot(ua), false, ua)
  }
})

test('límite de frecuencia: 30 por minuto y por IP; la clave es un HMAC, no la IP', () => {
  const limiter = createRateLimiter({ ...TRACK_RATE })
  const key = hashIp('203.0.113.7')
  assert.doesNotMatch(key, /203/)
  assert.match(key, /^[0-9a-f]{64}$/)
  assert.notEqual(key, hashIp('203.0.113.7', new Uint8Array([1, 2, 3])))
  for (let i = 0; i < 30; i++) assert.equal(limiter.isLimited(key, 1000), false)
  assert.equal(limiter.isLimited(key, 1000), true)
  assert.equal(limiter.isLimited(hashIp('203.0.113.8'), 1000), false)
  assert.equal(limiter.isLimited(key, 1000 + 60_001), false)
})

const fakeClient = (outcome, configured = true) => {
  const calls = []
  return {
    calls,
    configured,
    post: async (path, body, headers) => {
      calls.push({ path, body, headers })
      if (outcome instanceof Error) throw outcome
      return { ok: outcome === 204, status: outcome, data: null }
    }
  }
}

test('reenvía a la API con la clave de intake y nunca lanza', async () => {
  const payload = parse(base)
  const ok = fakeClient(204)
  assert.equal(await forwardTrack(ok, payload, 'clave'), true)
  assert.equal(ok.calls[0].path, '/api/intake/events')
  assert.equal(ok.calls[0].headers['x-intake-key'], 'clave')
  assert.deepEqual(ok.calls[0].body, payload)

  assert.equal(await forwardTrack(fakeClient(500), payload, 'clave'), false)
  assert.equal(await forwardTrack(fakeClient(0), payload, 'clave'), false)
  assert.equal(await forwardTrack(fakeClient(new Error('boom')), payload, 'clave'), false)
  const idle = fakeClient(204, false)
  assert.equal(await forwardTrack(idle, payload, 'clave'), false)
  assert.equal(idle.calls.length, 0)
  const noKey = fakeClient(204)
  assert.equal(await forwardTrack(noKey, payload, ''), false)
  assert.equal(noKey.calls.length, 0)
})
