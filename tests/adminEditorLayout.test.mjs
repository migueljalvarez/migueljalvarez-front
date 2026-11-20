import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { activeEditorSection, editorSectionStatus } from '../utils/admin/editorIndex.ts'
import {
  aboutSectionIndex,
  emptyAboutForm,
  validateAboutForm
} from '../utils/admin/about.ts'

const read = path => readFileSync(path, 'utf8')

test('el estado de una sección: error, completa o vacía', () => {
  assert.equal(editorSectionStatus({ 'stats.0.value': 'x' }, ['stats'], true), 'error')
  assert.equal(editorSectionStatus({}, ['stats'], true), 'ok')
  assert.equal(editorSectionStatus({}, ['stats'], false), 'empty')
  // Un error de otro campo no marca esta sección.
  assert.equal(editorSectionStatus({ heading: 'x' }, ['stats'], true), 'ok')
})

test('la sección activa es la última que cruza la línea de lectura', () => {
  const ids = ['a', 'b', 'c']
  assert.equal(activeEditorSection(ids, new Set(['a', 'b'])), 'b')
  assert.equal(activeEditorSection(ids, new Set()), null)
})

test('el índice de Sobre mí sigue el orden de la página, con contadores y errores a la vista', () => {
  const form = {
    ...emptyAboutForm(),
    heading: '',
    intro: '',
    stats: [
      { value: '10+', label: 'años' },
      { value: '4', label: 'sectores' },
      { value: '', label: '' }
    ],
    images: [{ path: '/about/a.webp', alt: 'a', isDefault: true }]
  }
  const errors = validateAboutForm(form).errors
  const index = aboutSectionIndex(form, errors)
  assert.deepEqual(
    index.map(item => item.label),
    [
      'Presentación',
      'Cifras',
      'Cómo pienso mi trabajo',
      'Fuera del trabajo',
      'Foto y datos',
      'Herramientas',
      'Llamada a la acción'
    ]
  )
  const by = id => index.find(item => item.id === id)
  assert.equal(by('about-intro-section').status, 'error') // título y presentación obligatorios vacíos
  assert.equal(by('about-stats-section').count, '3/4')
  assert.equal(by('about-stats-section').status, 'error') // la tercera fila está vacía
  assert.equal(by('about-photo-section').count, '1/4')
  assert.equal(by('about-photo-section').status, 'ok')
  assert.equal(by('about-tools-section').status, 'empty')
})

test('el layout es genérico y el editor de Sobre mí lo usa con la caja Publicar y el índice', () => {
  const layout = read('components/admin/AdminEditorLayout.vue')
  assert.ok(layout.includes('lg:sticky') && layout.includes('name="publish"'))
  assert.equal(/about|Sobre mí/i.test(layout.replace(/\/\/.*$/gm, '')), false)
  const editor = read('components/admin/about/AboutEditor.vue')
  assert.ok(editor.includes('<AdminEditorLayout') && editor.includes('#publish'))
  assert.equal(editor.includes('docs/about-guide.md'), false)
  assert.equal(editor.includes('van bajo las imágenes'), false)
})
