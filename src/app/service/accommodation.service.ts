import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Accommodation } from '../interfaces/accommodation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {
  private url: string;
  private api: string;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/accommodations/';
  }

  getAccommodations(): Observable<Accommodation[]> {
    return this.http.get<Accommodation[]>(`${this.url}${this.api}`);
  }

  getById(id: number): Observable<Accommodation> {
    return this.http.get<Accommodation>(`${this.url}${this.api}${id}`);
  }

  getByBudget(id: number): Observable<Accommodation[]> {
    return this.http.get<Accommodation[]>(`${this.url}${this.api}budget/${id}`);
  }

  addAccommodation(accommodation: Accommodation): Observable<Accommodation> {
    return this.http.post<Accommodation>(`${this.url}${this.api}`, accommodation);
  }

  updateAccommodation(accommodation: Accommodation): Observable<void> {
    return this.http.put<void>(`${this.url}${this.api}${accommodation.id}`, accommodation);
  }

  deleteAccommodation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.api}${id}`);
  }
}
