export interface Transfer {
  id?: number;
  origin: string,
  destination: string,
  type: string,
  conveyance: string,
  value: number;
  tax: number;
  detail: string;
  budgetId: number;
}
