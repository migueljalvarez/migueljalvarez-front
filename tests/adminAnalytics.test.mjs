import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buttonRows,
  clickButtonLabel,
  formatPercent,
  hasNoClickData,
  isValidClickRange,
  parseClicksSummary,
  pathRows,
  sourceRows,
  CLICK_BUTTON_LABEL,
  CLICKS_NOTE
} from '../utils/admin/analytics.ts'
import { TRACK_BUTTON_IDS } from '../constants/track.ts'

const summary = {
  range: '30d',
  total: 4,
  buttons: [
    { id: 'wa_hero', clicks: 3, percent: 75 },
    { id: 'nav_hablemos', clicks: 1, percent: 25 }
  ],
  formSubmitOk: 2,
  bySource: [{ source: 'linkedin', clicks: 1 }],
  byPath: [{ path: '/', clicks: 4 }],
  bySlug: []
}

test('valida la respuesta de la API y rechaza formas inesperadas', () => {
  assert.deepEqual(parseClicksSummary(summary), summary)
  assert.equal(parseClicksSummary(null), null)
  assert.equal(parseClicksSummary({ ...summary, total: -1 }), null)
  assert.equal(parseClicksSummary({ ...summary, range: '1y' }), null)
  assert.equal(parseClicksSummary({ ...summary, buttons: 'x' }), null)
  assert.deepEqual(parseClicksSummary({ ...summary, bySlug: undefined })?.bySlug, [])
})

test('cada botón de la lista cerrada tiene nombre legible en español', () => {
  for (const id of TRACK_BUTTON_IDS) assert.ok(CLICK_BUTTON_LABEL[id], id)
  assert.equal(clickButtonLabel('wa_hero'), 'WhatsApp · Portada')
  assert.equal(clickButtonLabel('nuevo_boton'), 'nuevo_boton')
})

test('filas: respeta el orden de la API y calcula el porcentaje de los desgloses', () => {
  const rows = buttonRows(summary)
  assert.deepEqual(
    rows.map(row => [row.label, row.clicks, row.percent]),
    [
      ['WhatsApp · Portada', 3, 75],
      ['Menú · Hablemos', 1, 25]
    ]
  )
  assert.deepEqual(sourceRows(summary), [
    { key: 'linkedin', label: 'linkedin', clicks: 1, percent: 25 }
  ])
  assert.equal(pathRows(summary)[0].percent, 100)
  assert.deepEqual(sourceRows({ ...summary, bySource: [] }), [])
})

test('estado vacío solo sin clics ni formularios; los porcentajes se formatean en español', () => {
  assert.equal(hasNoClickData({ ...summary, total: 0, formSubmitOk: 0, buttons: [] }), true)
  assert.equal(hasNoClickData({ ...summary, total: 0, formSubmitOk: 1, buttons: [] }), false)
  assert.equal(formatPercent(33.3), '33,3 %')
  assert.equal(formatPercent(100), '100 %')
  assert.equal(isValidClickRange('7d'), true)
  assert.equal(isValidClickRange('1y'), false)
  assert.match(CLICKS_NOTE, /no conversaciones iniciadas en WhatsApp/)
})
