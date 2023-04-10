import { Assistance } from "./assistance";
import { Excursion } from "./excursion";
import { Flight } from "./flight";
import { Hotel } from "./hotel";
import { Order } from "./order";
import { Transfer } from "./transfer";

export interface Budget {
  id?: number;
  total?: number;
  detail: string;
  orderId?: number;
  flights?: Flight[];
  hotels?: Hotel[];
  excursions?: Excursion[];
  assistances?: Assistance[];
  transfers?: Transfer[];
  order?:Order
}
