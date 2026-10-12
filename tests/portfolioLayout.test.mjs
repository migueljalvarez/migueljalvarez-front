import assert from 'node:assert/strict'
import test from 'node:test'
import { getPortfolioCtaColumnClass } from '../utils/portfolioLayout.ts'

test('CTA spans the remaining columns based on the visible portfolio item count', () => {
  const layouts = new Map([
    [0, 'xl:col-span-6'],
    [1, 'xl:col-span-3'],
    [2, 'xl:col-span-6'],
    [3, 'xl:col-span-4'],
    [4, 'xl:col-span-2'],
    [5, 'xl:col-span-6'],
    [6, 'xl:col-span-4']
  ])

  for (const [projectCount, expectedLayout] of layouts) {
    assert.equal(getPortfolioCtaColumnClass(projectCount), expectedLayout)
  }
})

test('CTA layout rejects invalid project counts', () => {
  assert.throws(() => getPortfolioCtaColumnClass(-1), RangeError)
  assert.throws(() => getPortfolioCtaColumnClass(1.5), RangeError)
})
