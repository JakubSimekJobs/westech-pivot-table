import type { RowEntry } from '@/components/table/constants'
import type { SalesEntry } from '@/api/sales';

export function initTable(data: SalesEntry[]): { rows: RowEntry[], head: string[] } {
  const rows: RowEntry[] = [];
  const uniqueStores = new Set<string>();

  const rowMap: { [categoryName: string]: RowEntry } = {};

  for (let i = 0; i < data.length; i++) {
    const { product: detailName, pcs: value, category: rowName, store: colName } = data[i];

    uniqueStores.add(colName);

    if (!rowMap[rowName]) {
      rowMap[rowName] = {
        name: rowName,
        cols: {},
        detail: [],
        open: false
      };
    }

    const currentRow = rowMap[rowName];

    if (!currentRow.cols[colName]) {
      currentRow.cols[colName] = 0;
    }

    currentRow.cols[colName] += value;


    // Handle detail entries
    let detailEntry = currentRow.detail.find(d => d.name === detailName);
    if (!detailEntry) {
      detailEntry = { name: detailName, cols: {} };
      currentRow.detail.push(detailEntry);
    }

    if (!detailEntry.cols[colName]) {
      detailEntry.cols[colName] = 0;
    }

    // Aggregate the value for this store under 'detail'
    detailEntry.cols[colName] += value;
  }

  const head = Array.from(uniqueStores).sort();

  for (const rowName in rowMap) {
    const currentRow = rowMap[rowName];

    currentRow.cols = Object.fromEntries(Object.entries(currentRow.cols).sort(([a], [b]) => a.localeCompare(b)));

    currentRow.detail.forEach(detail => {
      detail.cols = Object.fromEntries(Object.entries(detail.cols).sort(([a], [b]) => a.localeCompare(b)));
    });

    rows.push(currentRow);
  }

  return {
    rows,
    head,
  };
}
