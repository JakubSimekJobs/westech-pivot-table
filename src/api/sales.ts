import { useApi } from '@/composables/useApi'

export interface SalesEntry {
  product: string;
  pcs: number;
  category: string;
  store: string;
}

export function getProductSales() {
  return useApi<SalesEntry[]>('/fe-data');
}
