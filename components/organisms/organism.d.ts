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

export type ProjectListCardProps = {
  project: PortfolioCardProject
  /** Destacado: ancho completo, portada a la izquierda. */
  featured?: boolean
  /** Nivel del título bajo el h1 de la página. */
  headingLevel?: 'h2' | 'h3'
}

export type ProjectFillerCardProps = {
  headingLevel?: 'h2' | 'h3'
}

export type ProjectStoryProps = {
  problem?: string
  decision?: string
  result?: string
}

export type ProjectHighlightsProps = {
  items: { value: string; label: string }[]
}

export type ProjectScopeProps = {
  items: string[]
}

export type ProjectGalleryProps = {
  images: { src: string; alt: string; caption?: string }[]
}
