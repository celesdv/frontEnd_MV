import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Canned } from '../interfaces/canned';

@Injectable({
  providedIn: 'root'
})
export class CannedService {
  private url: string;
  private api: string;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/canneds/';
  }

  getCanneds(): Observable<Canned[]> {
    return this.http.get<Canned[]>(`${this.url}${this.api}`);
  }

  getById(id: number): Observable<Canned> {
    return this.http.get<Canned>(`${this.url}${this.api}${id}`);
  }

  getByBudget(id: number): Observable<Canned[]> {
    return this.http.get<Canned[]>(`${this.url}${this.api}budget/${id}`);
  }

  addCanned(canned: Canned): Observable<void> {
    return this.http.post<void>(`${this.url}${this.api}`, canned);
  }

  updateCanned(canned: Canned): Observable<void> {
    return this.http.put<void>(`${this.url}${this.api}${canned.id}`,canned);
  }

  deleteCanned(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.api}${id}`);
  }
}
