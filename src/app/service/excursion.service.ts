import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Excursion } from '../interfaces/excursion';

@Injectable({
  providedIn: 'root'
})
export class ExcursionService {
  private url: string;
  private api: string;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/excursions/';
  }

  getExcursions(): Observable<Excursion[]> {
    return this.http.get<Excursion[]>(`${this.url}${this.api}`);
  }

  getById(id: number): Observable<Excursion> {
    return this.http.get<Excursion>(`${this.url}${this.api}${id}`);
  }

  getByBudget(id: number): Observable<Excursion[]> {
    return this.http.get<Excursion[]>(`${this.url}${this.api}budget/${id}`);
  }

  addExcursion(excursion: Excursion): Observable<void> {
    return this.http.post<void>(`${this.url}${this.api}`, excursion);
  }

  updateExcursion(excursion: Excursion): Observable<void> {
    return this.http.put<void>(`${this.url}${this.api}${excursion.id}`,excursion);
  }

  deleteExcursion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.api}${id}`);
  }
}
