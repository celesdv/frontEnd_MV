import { Accommodation } from "./accommodation";
import { Assistance } from "./assistance";
import { Canned } from "./canned";
import { Excursion } from "./excursion";
import { Flight } from "./flight";
import { Hotel } from "./hotel";
import { Item } from "./item";
import { Order } from "./order";
import { Transfer } from "./transfer";

export interface Budget {
  id?: number;
  total?: number;
  detail: string;
  orderId?: number;
  flights?: Flight[];
  excursions?: Excursion[];
  assistance?: Assistance[];
  transfers?: Transfer[];
  canneds?: Canned[];
  accommodation?: Accommodation[],
  items?: Item[];
  order?:Order
}
