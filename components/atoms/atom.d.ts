export type ButtonProps = {
  size?: 'sm' | 'md' | 'lg'
  theme?: 'primary' | 'secondary' | 'tertiary'
  uppercase?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  disabled?: boolean
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
export type TitleProps = {
  text: string
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export type BadgeProps = {
  value: string
  theme: 'info' | 'success' | 'warning' | 'danger'
}

export type AvatarProps = {
  image: string
  name: string
  size?: 'sm' | 'md' | 'lg'
}
