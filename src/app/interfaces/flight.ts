import { Section } from "./section";

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
  section: Section[];
}
