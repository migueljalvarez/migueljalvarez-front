import assert from 'node:assert/strict'
import test from 'node:test'
import { getAvailablePortfolioFilters } from '../utils/portfolioFilters.ts'

test('shows only filters represented in the full project list', () => {
  assert.deepEqual(getAvailablePortfolioFilters([{ type: 'client' }, { type: 'product' }]), [
    'all',
    'client',
    'product'
  ])
  assert.deepEqual(getAvailablePortfolioFilters([{ type: 'client' }]), ['all', 'client'])
  assert.deepEqual(getAvailablePortfolioFilters([{ type: 'product' }, { type: 'product' }]), [
    'all',
    'product'
  ])
  assert.deepEqual(getAvailablePortfolioFilters([]), ['all'])
})
