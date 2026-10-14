import assert from 'node:assert/strict'
import test from 'node:test'
import { getPortfolioCardVariant, getPortfolioCtaColumnClass } from '../utils/portfolioLayout.ts'

test('marked primary projects receive the larger card variant', () => {
  assert.equal(getPortfolioCardVariant({ primary: true }, 3), 'primary')
  assert.equal(getPortfolioCardVariant({}, 3), 'secondary')
  assert.equal(getPortfolioCardVariant({}, 1), 'balanced')
})

test('CTA spans remaining columns for the rendered project variants', () => {
  const layouts = [
    [[], 'xl:col-span-6'],
    [['balanced'], 'xl:col-span-3'],
    [['secondary', 'secondary'], 'xl:col-span-2'],
    [['secondary', 'secondary', 'secondary'], 'xl:col-span-6'],
    [['primary'], 'xl:col-span-2'],
    [['primary', 'secondary'], 'xl:col-span-6'],
    [['primary', 'secondary', 'secondary'], 'xl:col-span-4']
  ]

  for (const [cardVariants, expectedLayout] of layouts) {
    assert.equal(getPortfolioCtaColumnClass(cardVariants), expectedLayout)
  }
})

test('CTA layout rejects unknown card variants', () => {
  assert.throws(() => getPortfolioCtaColumnClass(['unknown']), RangeError)
})
