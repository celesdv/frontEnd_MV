import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Budget } from '../interfaces/budget';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private url: string;
  private api: string;
  private budgetId: number = 0;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/budgets/';
  }

  getId() {
    return this.budgetId;
  }

  setId(id: number) {
    this.budgetId = id;
  }

  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.url}${this.api}`);
  }

  getById(id: number): Observable<Budget> {
    return this.http.get<Budget>(`${this.url}${this.api}${id}`);
  }

  addBudget(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(`${this.url}${this.api}`, budget);
  }

  updateBudget(budget: Budget): Observable<void> {
    return this.http.put<void>(`${this.url}${this.api}${budget.id}`, budget);
  }

  deleteBudget(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.api}${id}`);
  }
}
