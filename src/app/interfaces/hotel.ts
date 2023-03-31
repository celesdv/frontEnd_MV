export interface Hotel {
  id?: number;
  name: string,
  regime: string,
  nights: number,
  rooms: number,
  rooms_type: string,
  value: number;
  tax: number;
  detail: string;
  budgetId: number;
}
