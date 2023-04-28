import { Booking } from './booking';
import { Client } from './client';
import { Count } from './count';
import { User } from './user';

export interface Income {
  id?: number;
  total: number;
  total_usd: number;
  currency: string;
  date: string;
  detail: string;
  soft_delete?: boolean;
  clientId: number;
  client?: Client;
  bookingId: number;
  booking?: Booking;
  userIs: number;
  User?: User;
  countId: number;
  count: Count;
}
