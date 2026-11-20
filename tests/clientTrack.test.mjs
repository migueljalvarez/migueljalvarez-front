import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildTrackBody,
  deviceFor,
  normalizeTarget,
  readAttribution,
  referrerHostOf,
  sanitizeUtm,
  trackablePath
} from '../utils/track.ts'
import { TRACK_BUTTON_IDS } from '../constants/track.ts'
import { parseTrackBody } from '../server/utils/track.ts'

test('dispositivo: móvil por debajo de 768 px de ancho', () => {
  assert.equal(deviceFor(767), 'mobile')
  assert.equal(deviceFor(768), 'desktop')
  assert.equal(deviceFor(390), 'mobile')
})

test('el referrer se reduce al host y se vacía si es el propio sitio', () => {
  assert.equal(
    referrerHostOf('https://www.Google.com/search?q=secreto', 'migueljalvarez.com'),
    'www.google.com'
  )
  assert.equal(
    referrerHostOf('https://migueljalvarez.com/portafolio', 'migueljalvarez.com'),
    undefined
  )
  assert.equal(referrerHostOf('', 'x.com'), undefined)
  assert.equal(referrerHostOf('android-app://com.google.android.gm', 'x.com'), undefined)
  assert.equal(referrerHostOf('no es url', 'x.com'), undefined)
})

test('utm: se limpia y se descarta lo que no cumple el formato', () => {
  assert.equal(sanitizeUtm(' LinkedIn '), 'linkedin')
  assert.equal(sanitizeUtm('<b>'), undefined)
  assert.equal(sanitizeUtm('x'.repeat(61)), undefined)
  assert.equal(sanitizeUtm(null), undefined)
  assert.deepEqual(
    readAttribution(
      '?utm_source=Newsletter&utm_campaign=lanzamiento&otro=1',
      'https://t.co/abc',
      'migueljalvarez.com'
    ),
    { utmSource: 'newsletter', utmCampaign: 'lanzamiento', referrerHost: 't.co' }
  )
  assert.deepEqual(readAttribution('', '', 'x.com'), {})
})

test('rutas: sin barra final y nunca desde el panel, el login ni el enlace de testimonio', () => {
  assert.equal(trackablePath('/'), '/')
  assert.equal(trackablePath('/portafolio/mi-comodoro/'), '/portafolio/mi-comodoro')
  for (const path of ['/admin', '/admin/leads', '/login', '/testimonio/abc123', '/api/x']) {
    assert.equal(trackablePath(path), undefined, path)
  }
})

test('v-track: acepta cadena u objeto con slug y descarta lo inválido', () => {
  assert.deepEqual(normalizeTarget('wa_hero'), { id: 'wa_hero', slug: undefined })
  assert.deepEqual(normalizeTarget({ id: 'wa_proyecto', slug: 'mi-comodoro' }), {
    id: 'wa_proyecto',
    slug: 'mi-comodoro'
  })
  assert.equal(normalizeTarget(undefined), undefined)
  assert.equal(normalizeTarget('desconocido'), undefined)
  assert.equal(normalizeTarget('wa_proyecto'), undefined)
  assert.equal(normalizeTarget({ id: 'wa_hero', slug: 'x' }), undefined)
})

test('el cuerpo que arma el cliente lo acepta el validador estricto del servidor', () => {
  const attribution = { utmSource: 'linkedin', referrerHost: 'www.google.com' }
  const targets = TRACK_BUTTON_IDS.map(id =>
    id === 'wa_proyecto' || id === 'cta_ver_proyecto' ? { id, slug: 'mi-comodoro' } : id
  )
  for (const target of [...targets, 'form_submit_ok']) {
    const body = buildTrackBody(target, {
      pathname: '/portafolio/mi-comodoro/',
      width: 390,
      attribution
    })
    assert.ok(body, JSON.stringify(target))
    assert.ok(parseTrackBody(JSON.stringify(body)), JSON.stringify(body))
  }
  assert.equal(
    buildTrackBody('wa_hero', { pathname: '/admin', width: 1440, attribution: {} }),
    undefined
  )
})

test('«No contar mis visitas»: solo la marca exacta desactiva el conteo y un fallo del almacenamiento no lo bloquea', async () => {
  const { NO_TRACK_KEY, isTrackingDisabled, setTrackingDisabled } =
    await import('../utils/track.ts')
  const memory = () => {
    const data = new Map()
    return {
      getItem: key => data.get(key) ?? null,
      setItem: (key, value) => void data.set(key, String(value)),
      removeItem: key => void data.delete(key)
    }
  }
  const store = memory()
  assert.equal(NO_TRACK_KEY, 'mj_no_track')
  assert.equal(
    isTrackingDisabled(() => store),
    false
  )
  assert.equal(
    setTrackingDisabled(() => store, true),
    true
  )
  assert.equal(
    isTrackingDisabled(() => store),
    true
  )
  assert.equal(
    setTrackingDisabled(() => store, false),
    true
  )
  assert.equal(
    isTrackingDisabled(() => store),
    false
  )
  store.setItem(NO_TRACK_KEY, 'otro')
  assert.equal(
    isTrackingDisabled(() => store),
    false
  )

  const broken = () => {
    throw new Error('bloqueado')
  }
  assert.equal(isTrackingDisabled(broken), false)
  assert.equal(setTrackingDisabled(broken, true), false)
  assert.equal(
    isTrackingDisabled(() => undefined),
    false
  )
  assert.equal(
    setTrackingDisabled(() => undefined, true),
    false
  )
})
