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

test('el índice del Portafolio sigue el orden de la página y marca lo que falta', async () => {
  const { portfolioSectionIndex, validatePortfolioForm } = await import('../utils/admin/portfolio.ts')
  const empty = {
    title: '', slug: '', kind: 'product', status: 'published', description: '', url: '', tags: ['a'],
    audience: '', role: '', year: '', duration: '', problem: '', decision: '', result: '',
    highlights: [], scope: [], technologies: [], coverPath: '', ogPath: '', gallery: [],
    isPublished: false, featured: false, sortOrder: '0'
  }
  const index = portfolioSectionIndex(empty, validatePortfolioForm(empty).errors)
  assert.deepEqual(index.map(item => item.id), [
    'portfolio-basic', 'portfolio-card', 'portfolio-story', 'portfolio-highlights',
    'portfolio-scope', 'portfolio-images', 'portfolio-publication'
  ])
  assert.equal(index.find(i => i.id === 'portfolio-basic').status, 'error') // título obligatorio
  assert.equal(index.find(i => i.id === 'portfolio-card').count, '1/4')
  assert.equal(index.find(i => i.id === 'portfolio-highlights').status, 'empty')
})

test('el editor del Portafolio usa el layout y deja publicar solo en la caja lateral', () => {
  const editor = read('components/admin/portfolio/PortfolioEditor.vue')
  assert.ok(editor.includes('<AdminEditorLayout') && editor.includes('part="status"') && editor.includes('part="settings"'))
  const panel = read('components/admin/portfolio/PortfolioPublishPanel.vue')
  assert.equal((panel.match(/id="portfolio-published"/g) || []).length, 1)
})
