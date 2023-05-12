import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Outcome } from '../interfaces/outcome';

@Injectable({
  providedIn: 'root'
})
export class OutcomeService {
  private url: string;
  private api: string;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/outcomes/';
  }

  getOutcomes(): Observable<Outcome[]> {
    return this.http.get<Outcome[]>(`${this.url}${this.api}`);
  }

  getOutcomesOnly(): Observable<Outcome[]> {
    return this.http.get<Outcome[]>(`${this.url}${this.api}/outcome`);
  }

  getById(id: number): Observable<Outcome> {
    return this.http.get<Outcome>(`${this.url}${this.api}${id}`);
  }

  getBySupplier(id: number): Observable<Outcome[]> {
    return this.http.get<Outcome[]>(`${this.url}${this.api}${id}/supplier`);
  }

  getByCount(id: number): Observable<Outcome[]> {
    return this.http.get<Outcome[]>(`${this.url}${this.api}${id}/count`);
  }

  getByBooking(id: number): Observable<Outcome[]> {
    return this.http.get<Outcome[]>(`${this.url}${this.api}${id}/booking`);
  }

  addOutcome(outcome: Outcome): Observable<Outcome> {
    return this.http.post<Outcome>(`${this.url}${this.api}`, outcome);
  }

  updateOutcome(outcome: Outcome): Observable<void> {
    return this.http.put<void>(`${this.url}${this.api}${outcome.id}`, outcome);
  }

  deleteOutcome(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.api}${id}`);
  }
}
