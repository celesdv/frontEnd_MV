import { Extra } from "./extras";
import { Hotel } from "./hotel";

export interface Accommodation {
  id?: number;
  name: string;
  nights: number;
  value: number;
  tax: number;
  detail: string;
  supplierId: number;
  budgetId: number;
  hotel: Hotel[];
  extras: Extra[];
}
