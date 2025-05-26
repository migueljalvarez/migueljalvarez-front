type RenderableComponent = {
  component: string;
  props?: {
    default?: Array<RenderableComponent>;
  } & Record<string, unknown>;
};

type TableCellType = string | number | RenderableComponent;
type TableRowType = TableCellType[];
export type TableDataType = TableRowType[];
export type DynamicTableProps = {
  rows: TableDataType;
  headers?: string[];
  columnIndex?: number;
};
