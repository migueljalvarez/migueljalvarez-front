import type { LegalSection } from '~/types/legal'

export type LegalDocumentProps = {
  eyebrow: string
  title: string
  navLabel: string
  /** Fecha ISO (AAAA-MM-DD) de la última actualización. */
  updatedAt: string
  sections: LegalSection[]
}

export type {
  PortfolioCardProject,
  PortfolioCardVariant,
  PortfolioFilter,
  PortfolioLayoutMode
} from '~/types/portfolio'
