import { Supplier } from './supplier';

export interface Transfer {
  id?: number;
  origin: string;
  destination: string;
  type: string;
  conveyance: string;
  value: number;
  tax: number;
  detail: string;
  budgetId: number;
  supplierId: number;
  supplier?: Supplier;
  soft_delete?: boolean;
}
