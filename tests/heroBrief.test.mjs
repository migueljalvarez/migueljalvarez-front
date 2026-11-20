import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { nextScenarioIndex, tabIndexForKey } from '../utils/heroBrief.ts'

const read = path => readFileSync(path, 'utf8')

test('la rotación avanza y vuelve al primer escenario', () => {
  assert.equal(nextScenarioIndex(0, 3), 1)
  assert.equal(nextScenarioIndex(2, 3), 0)
  assert.equal(nextScenarioIndex(0, 0), 0)
})

test('las pestañas navegan con flechas, Inicio y Fin', () => {
  assert.equal(tabIndexForKey('ArrowRight', 2, 3), 0)
  assert.equal(tabIndexForKey('ArrowLeft', 0, 3), 2)
  assert.equal(tabIndexForKey('Home', 2, 3), 0)
  assert.equal(tabIndexForKey('End', 0, 3), 2)
  assert.equal(tabIndexForKey('Enter', 0, 3), null)
})

test('los escenarios viven en constantes y reflejan las tres tarjetas de servicios', () => {
  const src = read('constants/heroBrief.ts')
  assert.equal([...src.matchAll(/id: '/g)].length, 3)
  for (const tab of ['Tengo una idea', 'Ya tengo algo', 'Debo decidir']) assert.ok(src.includes(tab))
  assert.ok(src.includes('Ejemplos ilustrativos de cómo arranco cada conversación.'))
  assert.ok(!read('components/organisms/HeroBriefCard/HeroBriefCard.vue').includes('Tengo una idea'))
})

test('el hero tiene un único h1 con el titular completo y sin hexágonos', () => {
  const main = read('components/templates/Main/Main.vue')
  assert.equal([...main.matchAll(/<h1\b/g)].length, 1)
  assert.ok(!/hexagon/i.test(main))
  assert.ok(!main.includes('Antes de escribir')) // el texto vive en HOME_HERO_COPY
  const copy = read('constants/common/index.ts')
  assert.ok(copy.includes("code: 'código'") && copy.includes("problem: 'problema'"))
})

test('el enlace de WhatsApp del hero no cambia y la tarjeta lleva su ID de conteo', () => {
  assert.ok(read('constants/common/index.ts').includes("WHATSAPP_URL = 'https://wa.link/bxjfgq'"))
  const main = read('components/templates/Main/Main.vue')
  assert.ok(main.includes(`v-track="'wa_hero'"`) && main.includes(`v-track="'cta_ver_como_trabajo'"`))
  assert.ok(read('constants/heroBrief.ts').includes("ctaTrackId: 'cta_hero_card'"))
})

test('la tarjeta es accesible y no anima el texto para lectores de pantalla', () => {
  const card = read('components/organisms/HeroBriefCard/HeroBriefCard.vue')
  for (const needle of ['role="tablist"', 'role="tab"', 'role="tabpanel"', 'sr-only', 'aria-hidden="true"'])
    assert.ok(card.includes(needle), needle)
  assert.ok(card.includes('prefers-reduced-motion'))
})
