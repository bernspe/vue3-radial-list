export interface RadialItem {
  id?: string | number
  label: string
  icon?: string // allow inline SVG or HTML string for icons
  disabled?: boolean
  ariaLabel?: string
  meta?: any
}