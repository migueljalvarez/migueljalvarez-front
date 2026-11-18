import type { ServiceOffering } from '~/data/services'
import type {
  PortfolioCardProject,
  PortfolioCardVariant,
  PortfolioLayoutMode
} from '~/types/portfolio'

export type SectionProps = {
  id: string
  title?: string
  background?: string
  backgroundImage?: string
}

export type ProjectCardProps = {
  project: PortfolioCardProject
  variant: PortfolioCardVariant
  layoutMode: PortfolioLayoutMode
  showTypeBadge: boolean
  /** Nivel del título según el contexto (h3 bajo un h2 de sección; h2 bajo el h1 de la página). */
  headingLevel?: 'h2' | 'h3'
}

export type ServiceCardProps = {
  offering: ServiceOffering
}
