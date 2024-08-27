export interface RowEntry {
  name: string;
  cols: colData;
  detail: DetailEntry[];
  open: boolean;
}

export interface DetailEntry {
  name: string;
  cols: colData;
}

export interface colData {
  [colName: string]: number;
}
