const columnSpanClasses: Partial<Record<number, string>> = {
  2: 'xl:col-span-2',
  3: 'xl:col-span-3',
  4: 'xl:col-span-4',
  5: 'xl:col-span-5',
  6: 'xl:col-span-6'
} as const

export function getPortfolioCtaColumnClass(projectCount: number): string {
  if (!Number.isInteger(projectCount) || projectCount < 0) {
    throw new RangeError('Project count must be a non-negative integer')
  }

  const occupiedColumns = Math.min(projectCount, 2) * 3 + Math.max(projectCount - 2, 0) * 2
  const remainingColumns = 6 - (occupiedColumns % 6) || 6
  const spanClass = columnSpanClasses[remainingColumns]

  if (!spanClass) {
    throw new RangeError(`No CTA layout exists for ${remainingColumns} remaining columns`)
  }

  return spanClass
}
