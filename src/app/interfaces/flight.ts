import { Section } from './section';
import { Supplier } from './supplier';

export interface Flight {
  id?: number;
  origin: string;
  destination: string;
  date: string;
  baggage: string;
  value: number;
  tax: number;
  detail: string;
  budgetId: number;
  supplierId: number;
  sections: Section[];
  supplier?: Supplier;
  soft_delete?: boolean;
}
