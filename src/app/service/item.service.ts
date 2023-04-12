import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Item } from '../interfaces/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private url: string;
  private api: string;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/items/';
  }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.url}${this.api}`);
  }

  getById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.url}${this.api}${id}`);
  }

  getByBudget(id: number): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.url}${this.api}budget/${id}`);
  }

  addItem(item: Item): Observable<void> {
    return this.http.post<void>(`${this.url}${this.api}`, item);
  }

  updateItem(item: Item): Observable<void> {
    return this.http.put<void>(`${this.url}${this.api}${item.id}`,item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.api}${id}`);
  }
}
