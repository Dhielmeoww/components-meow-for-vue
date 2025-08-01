// Base types for components
export interface BaseDialogProps {
  modelValue: boolean
  persistent?: boolean
  maximized?: boolean
  fullWidth?: boolean
  fullHeight?: boolean
  title?: string
  subtitle?: string
  icon?: string
  showCloseButton?: boolean
  loading?: boolean
}

export interface BaseInputTextProps {
  modelValue: string | number
  label?: string
  placeholder?: string
  type?: string
  outlined?: boolean
  filled?: boolean
  dense?: boolean
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  rules?: Array<(val: any) => boolean | string>
  errorMessage?: string
  helperText?: string
}

export interface BaseSelectOption {
  label: string
  value: any
  description?: string
  icon?: string
  disabled?: boolean
}

export interface BaseSelectProps {
  modelValue: any
  options: BaseSelectOption[]
  label?: string
  placeholder?: string
  multiple?: boolean
  searchable?: boolean
  clearable?: boolean
  disable?: boolean
  required?: boolean
  rules?: Array<(val: any) => boolean | string>
  errorMessage?: string
}

export interface BaseTableColumn {
  name: string
  label: string
  field: string | ((row: any) => any)
  align?: 'left' | 'right' | 'center'
  sortable?: boolean
  format?: (val: any, row: any) => string
  type?: 'text' | 'badge' | 'chip' | 'button' | 'icon' | 'avatar' | 'actions'
  color?: string
  icon?: string
  filter_key?: string
  dropdown_data?: BaseSelectOption[]
}

export interface BaseTableProps {
  modelValue?: any[]
  rows?: any[]
  columns: BaseTableColumn[]
  rowKey?: string
  title?: string
  subtitle?: string
  showHeader?: boolean
  showFilters?: boolean
  showAddButton?: boolean
  serverSide?: boolean
  endpoint?: string
  loading?: boolean
  selection?: 'single' | 'multiple' | 'none'
}

export interface EssentialLinkProps {
  name: string
  description?: string
  url?: string
  icon?: string
  iconsax?: string
  children?: EssentialLinkProps[]
}

export interface VsxIconProps {
  iconName: string
  color?: string
  size?: number | string
  variant?: string
}