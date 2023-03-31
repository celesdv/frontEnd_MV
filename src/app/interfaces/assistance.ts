export interface Transfer {
  id?: number;
  name: string,
  type: string,
  value: number;
  tax: number;
  detail: string;
  budgetId: number;
}
