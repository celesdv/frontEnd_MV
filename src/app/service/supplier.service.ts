import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Supplier } from '../interfaces/supplier';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private url: string;
  private api: string;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/suppliers/';
  }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.url}${this.api}`);
  }

  getById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.url}${this.api}${id}`);
  }

  addSupplier(supplier: Supplier): Observable<string> {
    return this.http.post<string>(`${this.url}${this.api}`, supplier);
  }

  updateSupplier(supplier: Supplier): Observable<void> {
    return this.http.put<void>(`${this.url}${this.api}${supplier.id}`, supplier);
  }

  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.api}${id}`);
  }
}
