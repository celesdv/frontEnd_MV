import { Budget } from "./budget";
import { Client } from "./client";
import { Pax } from "./pax";

export interface Booking {
  id?: number;
  reference: string;
  travel_date: string;
  detail: string;
  soft_delete?: boolean;
  budgetId:number,
  clientId:number,
  client?: Client,
  budget?: Budget,
  paxes: Pax[],
  total: number
}
