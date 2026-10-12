import assert from 'node:assert/strict'
import test from 'node:test'
import { getPortfolioCtaLayout } from '../utils/portfolioLayout.ts'

test('CTA fills a six-column grid based on the visible portfolio item count', () => {
  const layouts = new Map([
    [0, 'xl:col-span-6 xl:flex-row xl:items-center'],
    [1, 'xl:col-span-3 xl:flex-col xl:items-start'],
    [2, 'xl:col-span-6 xl:flex-row xl:items-center'],
    [3, 'xl:col-span-4 xl:flex-row xl:items-center'],
    [4, 'xl:col-span-2 xl:flex-col xl:items-start'],
    [5, 'xl:col-span-6 xl:flex-row xl:items-center'],
    [6, 'xl:col-span-4 xl:flex-row xl:items-center']
  ])

  for (const [projectCount, expectedLayout] of layouts) {
    assert.equal(getPortfolioCtaLayout(projectCount), expectedLayout)
  }
})

test('CTA layout rejects invalid project counts', () => {
  assert.throws(() => getPortfolioCtaLayout(-1), RangeError)
  assert.throws(() => getPortfolioCtaLayout(1.5), RangeError)
})
