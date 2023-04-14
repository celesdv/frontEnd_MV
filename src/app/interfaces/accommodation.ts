import { Extra } from "./extras";
import { Hotel } from "./hotel";
import { Supplier } from "./supplier";

export interface Accommodation {
  id?: number;
  name: string;
  nights: number;
  value: number;
  tax: number;
  detail: string;
  supplierId: number;
  budgetId: number;
  hotels: Hotel[];
  extras: Extra[];
  supplier?: Supplier;
  soft_delete?: boolean;
}
