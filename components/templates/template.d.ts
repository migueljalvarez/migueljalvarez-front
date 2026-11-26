import type { PortfolioType } from '~/types/common'
import type { Guide } from '~/types/guide'
import type { LegalSection } from '~/types/legal'
import type { PortfolioCardProject } from '~/types/portfolio'
import type { PricingTerm, ServiceOfferView } from '~/types/pricing'

export type PortfolioListProps = {
  projects: PortfolioCardProject[]
  eyebrow?: string
  heading?: string
  description?: string
  /** h1 en la página; h2 en la home (las tarjetas bajan un nivel). */
  headingLevel?: 'h1' | 'h2'
  sectionId?: string
  /** Chips de filtro por tipo (solo aparecen si hay proyectos de ambos tipos). La home los omite. */
  showFilters?: boolean
  /** Enlace «Ver todos los proyectos» (home). */
  showViewAll?: boolean
  /** Animación de entrada al hacerse visible. */
  reveal?: boolean
}

export type ProjectDetailProps = {
  project: PortfolioType
}

export type PricingContentProps = {
  offers: ServiceOfferView[]
  terms: PricingTerm[]
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

export type { PortfolioCardProject, PortfolioFilter } from '~/types/portfolio'
