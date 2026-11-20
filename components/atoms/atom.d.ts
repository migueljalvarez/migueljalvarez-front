import type { Component } from 'nuxt/schema'

export type ButtonProps = {
  size?: 'sm' | 'md' | 'lg'
  theme?: 'primary' | 'secondary' | 'tertiary' | 'whatsapp'
  /** Fondo oscuro: el foco y el contorno se dibujan en claro. */
  onDark?: boolean
  /** Ruta interna: renderiza un NuxtLink (navegación SPA). */
  to?: string
  uppercase?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  href?: string
  target?: string
  rel?: string
  as?: 'button' | 'a'
  /** Enviando: mantiene el aspecto principal, muestra un indicador y marca `aria-busy`. */
  loading?: boolean
}

export type InputProps = {
  type: 'text' | 'email'
  name?: string
  label?: string
  required?: boolean
  placeHolder?: string
  modelValue?: string
  disabled?: boolean
  pattern: RegExp
  tag?: 'input' | 'textarea'
  errorMessage?: string
  rows?: number
}
export type CheckboxProps = {
  name: string
  modelValue?: boolean
  required?: boolean
  disabled?: boolean
  /** `light` para superficies claras (por defecto `dark`, el panel de contacto). */
  tone?: 'dark' | 'light'
  invalid?: boolean
  describedby?: string
}
export type TitleProps = {
  text: string
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export type SelectProps = {
  modelValue: string
  name: string
  label?: string
  options: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
}

export type EyebrowProps = {
  tone?: 'light' | 'dark'
  as?: 'p' | 'span'
}

export type ChipProps = {
  tone?: 'neutral' | 'brand' | 'success' | 'warning'
  size?: 'sm' | 'md'
  /** Forma de píldora (rounded-full). */
  pill?: boolean
  /** Mayúsculas con tracking (etiquetas de tipo). */
  uppercase?: boolean
}

export type CardProps = {
  tone?: 'light' | 'soft' | 'dark'
  as?: string
  /** Sombra de marca (shadow-card). */
  elevated?: boolean
}

export type HexMarkerProps = {
  label: string
  active?: boolean
  compact?: boolean
  /** `dark`: sobre fondos oscuros, el activo lleva el ámbar de marca (texto navy). */
  tone?: 'light' | 'dark'
  /** Texto accesible; si se omite el marcador es decorativo. */
  ariaLabel?: string
}

export type ImagePlaceholderProps = {
  /** Texto accesible; sin él el placeholder es decorativo (`aria-hidden`). */
  label?: string
}

export type AppLogoProps = {
  /** Fondo donde se coloca: `light` = logo a color, `dark` = logo blanco. */
  surface?: 'light' | 'dark'
  /** Alto en píxeles (el ancho sale de la proporción del SVG). */
  height?: number
  alt?: string
  /** Decorativo: sin texto alternativo (p. ej. el logo oculto de un fundido cruzado). */
  decorative?: boolean
}
