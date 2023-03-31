import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../interfaces/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private url: string;
  private api: string;
  private orderId: number = 0;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/orders/';
  }

  getId() {
    return this.orderId;
  }

  setId(id: number) {
    this.orderId = id;
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}${this.api}`);
  }

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.url}${this.api}${id}`);
  }

  addOrder(order: Order): Observable<string> {
    return this.http.post<string>(`${this.url}${this.api}`, order);
  }

  updateOrder(order: Order): Observable<void> {
    return this.http.put<void>(`${this.url}${this.api}${order.id}`, order);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.api}${id}`);
  }
}
