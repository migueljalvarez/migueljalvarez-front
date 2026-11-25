import type { PortfolioType } from '~/types/common'
import type { Guide } from '~/types/guide'
import type { LegalSection } from '~/types/legal'
import type { PortfolioCardProject } from '~/types/portfolio'

export type PortfolioListProps = {
  projects: PortfolioCardProject[]
}

export type ProjectDetailProps = {
  project: PortfolioType
}

export type GuideArticleProps = {
  guide: Guide
}

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
