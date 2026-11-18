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
  /** Texto accesible; si se omite el marcador es decorativo. */
  ariaLabel?: string
}
