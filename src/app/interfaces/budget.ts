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
  hotels?: Hotel[];
  excursions?: Excursion[];
  assistance?: Assistance[];
  transfers?: Transfer[];
  canneds?: Canned[];
  items?: Item[];
  order?:Order
}
