/**
 * Clases del control de texto del panel (campo, área, lista). Alto táctil 44 px (`min-h-11`) y radio de
 * control `rounded-lg`, igual que AdminButton y la landing. El borde usa `brand-helper` (3,6:1 sobre
 * blanco): el borde de un campo es un componente de interfaz y debe llegar a 3:1 (WCAG 1.4.11);
 * `brand-border` (1,1:1) no alcanza.
 */
export const ADMIN_CONTROL_BASE =
  'min-h-11 w-full rounded-lg border bg-brand-surface px-3 py-2.5 text-sm text-brand-ink transition placeholder:text-brand-helper focus:border-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue'

export const adminControlState = (invalid: boolean) =>
  invalid ? 'border-brand-error-text' : 'border-brand-helper'
