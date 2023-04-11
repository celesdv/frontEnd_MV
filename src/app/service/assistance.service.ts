import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Assistance } from '../interfaces/assistance';

@Injectable({
  providedIn: 'root',
})
export class AssistanceService {
  private url: string;
  private api: string;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/assistances/';
  }

  getAssistances(): Observable<Assistance[]> {
    return this.http.get<Assistance[]>(`${this.url}${this.api}`);
  }

  getById(id: number): Observable<Assistance> {
    return this.http.get<Assistance>(`${this.url}${this.api}${id}`);
  }

  getByBudget(id: number): Observable<Assistance[]> {
    return this.http.get<Assistance[]>(`${this.url}${this.api}budget/${id}`);
  }

  addAssistance(assistance: Assistance): Observable<void> {
    return this.http.post<void>(`${this.url}${this.api}`, assistance);
  }

  updateAssistance(assistance: Assistance): Observable<void> {
    return this.http.put<void>(`${this.url}${this.api}${assistance.id}`,assistance);
  }

  deleteAssistance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.api}${id}`);
  }
}
