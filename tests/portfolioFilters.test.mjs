import assert from 'node:assert/strict'
import test from 'node:test'
import { getAvailablePortfolioFilters } from '../utils/portfolioFilters.ts'

test('shows only filters represented in the full project list', () => {
  assert.deepEqual(
    getAvailablePortfolioFilters([{ type: 'cliente' }, { type: 'propio' }]),
    ['Todos', 'Clientes', 'Productos propios']
  )
  assert.deepEqual(getAvailablePortfolioFilters([{ type: 'cliente' }]), ['Todos', 'Clientes'])
  assert.deepEqual(
    getAvailablePortfolioFilters([{ type: 'propio' }, { type: 'propio' }]),
    ['Todos', 'Productos propios']
  )
  assert.deepEqual(getAvailablePortfolioFilters([]), ['Todos'])
})
