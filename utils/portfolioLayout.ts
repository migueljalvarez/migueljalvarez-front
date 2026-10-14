import type { PortfolioCardVariant } from '../components/templates/Portfolio/portfolio.types'

const columnSpanClasses: Partial<Record<number, string>> = {
  2: 'xl:col-span-2',
  3: 'xl:col-span-3',
  4: 'xl:col-span-4',
  5: 'xl:col-span-5',
  6: 'xl:col-span-6'
} as const

const cardColumnSpans: Record<PortfolioCardVariant, number> = {
  primary: 4,
  secondary: 2,
  balanced: 3
}

export function getPortfolioCardVariant(
  project: { primary?: boolean },
  projectCount: number
): PortfolioCardVariant {
  if (project.primary) return 'primary'
  if (projectCount === 1) return 'balanced'
  return 'secondary'
}

export function getPortfolioCtaColumnClass(cardVariants: PortfolioCardVariant[]): string {
  const occupiedColumns = cardVariants.reduce((total, variant) => {
    const columns = cardColumnSpans[variant]

    if (!columns) {
      throw new RangeError(`Unknown portfolio card variant: ${variant}`)
    }

    return total + columns
  }, 0)
  const remainingColumns = 6 - (occupiedColumns % 6) || 6
  const spanClass = columnSpanClasses[remainingColumns]

  if (!spanClass) {
    throw new RangeError(`No CTA layout exists for ${remainingColumns} remaining columns`)
  }

  return spanClass
}
