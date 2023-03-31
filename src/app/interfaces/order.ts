export interface Order {
  id?: number;
  name: string;
  destination: string;
  date: string;
  nights: number;
  email: string;
  phone: string;
  detail: string;
  toddler: number;
  child: number;
  teen: number;
  adult: number;
  senior: number;
  is_budget?: boolean;
  userId?: number;
}
