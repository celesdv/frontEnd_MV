import { Booking } from './booking';
import { Count } from './count';
import { Supplier } from './supplier';
import { User } from './user';

export interface Outcome {
  id?: number;
  total: number;
  total_usd: number;
  currency: string;
  date: string;
  detail: string;
  soft_delete?: boolean;
  bookingId?: number;
  booking?: Booking;
  userId: number;
  User?: User;
  countId: number;
  count?: Count;
  supplierId: number;
  supplier?: Supplier;
}
