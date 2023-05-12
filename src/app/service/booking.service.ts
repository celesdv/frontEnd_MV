import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Booking } from '../interfaces/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private url: string;
  private api: string;
  private budgetId: number = 0;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/bookings/';
  }

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.url}${this.api}`);
  }

  getBookingsOnly(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.url}${this.api}/bookings`);
  }

  getById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.url}${this.api}${id}`);
  }

  getByClient(id: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.url}${this.api}${id}/client`);
  }

  getBySupplier(id: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.url}${this.api}${id}/supplier`);
  }

  addBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(`${this.url}${this.api}`, booking);
  }

  updateBooking(booking: Booking): Observable<void> {
    return this.http.put<void>(`${this.url}${this.api}${booking.id}`, booking);
  }

  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.api}${id}`);
  }
}
