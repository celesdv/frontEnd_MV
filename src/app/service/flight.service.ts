import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Flight } from '../interfaces/flight';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private url: string;
  private api: string;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/flights/';
  }

  getFlight(): Observable<Flight[]> {
    return this.http.get<Flight[]>(`${this.url}${this.api}`);
  }

  getById(id: number): Observable<Flight> {
    return this.http.get<Flight>(`${this.url}${this.api}${id}`);
  }

  addFlight(flight: Flight): Observable<Flight> {
    return this.http.post<Flight>(`${this.url}${this.api}`, flight);
  }

  updateFlight(flight: Flight): Observable<void> {
    return this.http.put<void>(`${this.url}${this.api}${flight.id}`, flight);
  }

  deleteFlight(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.api}${id}`);
  }
}
