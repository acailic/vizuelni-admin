export interface TransformAxisConfig {
  field: string
  label?: string
  type?: 'linear' | 'category' | 'date'
  format?: string
}

export interface TransformContext {
  type: string
  x_axis?: TransformAxisConfig
  y_axis?: TransformAxisConfig
}
