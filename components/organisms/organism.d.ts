import type { ServiceOffering } from '~/data/services'
import type { PortfolioCardProject } from '~/types/portfolio'
import type { ServiceOfferView } from '~/types/pricing'

export type SectionProps = {
  id: string
  title?: string
  background?: string
  backgroundImage?: string
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

export type ServiceOfferCardProps = {
  offer: ServiceOfferView
  /** Texto cuando la oferta no tiene precio (respaldo del código). */
  unpricedLabel: string
}
