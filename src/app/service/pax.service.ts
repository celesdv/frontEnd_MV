import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pax } from '../interfaces/pax';

@Injectable({
  providedIn: 'root'
})
export class PaxService {
  private url: string;
  private api: string;
  private budgetId: number = 0;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/paxes/';
  }

  getPaxes(): Observable<Pax[]> {
    return this.http.get<Pax[]>(`${this.url}${this.api}`);
  }

  getById(id: number): Observable<Pax> {
    return this.http.get<Pax>(`${this.url}${this.api}${id}`);
  }

  addPax(pax: Pax): Observable<Pax> {
    return this.http.post<Pax>(`${this.url}${this.api}`, pax);
  }

  updatePax(pax: Pax): Observable<void> {
    return this.http.put<void>(`${this.url}${this.api}${pax.id}`, pax);
  }

  deletePax(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.api}${id}`);
  }
}
