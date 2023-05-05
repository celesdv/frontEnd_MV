import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Income } from '../interfaces/income';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  private url: string;
  private api: string;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/incomes/';
  }

  getIncomes(): Observable<Income[]> {
    return this.http.get<Income[]>(`${this.url}${this.api}`);
  }

  getIncomesOnly(): Observable<Income[]> {
    return this.http.get<Income[]>(`${this.url}${this.api}/incomes`);
  }

  getById(id: number): Observable<Income> {
    return this.http.get<Income>(`${this.url}${this.api}${id}`);
  }

  getByClient(id: number): Observable<Income[]> {
    return this.http.get<Income[]>(`${this.url}${this.api}${id}/client`);
  }

  getByCount(id: number): Observable<Income[]> {
    return this.http.get<Income[]>(`${this.url}${this.api}${id}/count`);
  }

  getByBooking(id: number): Observable<Income[]> {
    return this.http.get<Income[]>(`${this.url}${this.api}${id}/booking`);
  }

  addIncome(income: Income): Observable<Income> {
    return this.http.post<Income>(`${this.url}${this.api}`, income);
  }

  updateIncome(income: Income): Observable<void> {
    return this.http.put<void>(`${this.url}${this.api}${income.id}`, income);
  }

  deleteIncome(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.api}${id}`);
  }
}
