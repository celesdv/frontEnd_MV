import { Supplier } from "./supplier";

export interface Excursion {
  id?: number;
  name: string;
  date: string;
  value: number;
  tax: number;
  detail: string;
  budgetId: number;
  supplierId: number;
  supplier?: Supplier;
  soft_delete?: boolean;
}
