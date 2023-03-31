import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Count } from '../interfaces/count';

@Injectable({
  providedIn: 'root',
})
export class CountService {
  private url: string;
  private api: string;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/counts/';
  }

  getCounts(): Observable<Count[]> {
    return this.http.get<Count[]>(`${this.url}${this.api}`);
  }

  getById(id: number): Observable<Count> {
    return this.http.get<Count>(`${this.url}${this.api}${id}`);
  }

  addCount(count: Count): Observable<string> {
    return this.http.post<string>(`${this.url}${this.api}`, count);
  }

  updateCount(count: Count): Observable<void> {
    return this.http.put<void>(`${this.url}${this.api}${count.id}`, count);
  }

  deleteCount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.api}${id}`);
  }
}
