export interface Pax {
  id?: number;
  first_name: string;
  last_name: string;
  dni: string;
  birth_date: string;
  passport: string;
  expiration: string;
  soft_delete?:boolean;
  bookingId?:number
}
