import { Supplier } from './supplier';

export interface Assistance {
  id?: number;
  name: string;
  type: string;
  value: number;
  tax: number;
  detail: string;
  budgetId: number;
  supplierId: number;
  supplier?: Supplier;
  soft_delete?: boolean;
}
