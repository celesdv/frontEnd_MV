import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Extra } from '../interfaces/extras';

@Injectable({
  providedIn: 'root'
})
export class ExtraService {
  private url: string;
  private api: string;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/extras/';
  }

  getExtras(): Observable<Extra[]> {
    return this.http.get<Extra[]>(`${this.url}${this.api}`);
  }

  getById(id: number): Observable<Extra> {
    return this.http.get<Extra>(`${this.url}${this.api}${id}`);
  }

  addExtra(extra: Extra): Observable<Extra> {
    return this.http.post<Extra>(`${this.url}${this.api}`, extra);
  }

  updateExtra(extra:Extra): Observable<void> {
    console.log(extra.id)
    return this.http.put<void>(`${this.url}${this.api}${extra.id}`, extra);
  }

  deleteExtra(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.api}${id}`);
  }
}
