import type { Component } from 'vue'
export type RenderableComponent = {
  component: string | Component
  props?: {
    default?: Array<RenderableComponent>
  } & Record<string, unknown>
}

type TableCellType = string | number | RenderableComponent
type TableRowType = TableCellType[]
export type TableDataType = TableRowType[]
export type DynamicTableProps = {
  rows: TableDataType
  headers?: string[]
  columnIndex?: number
}
