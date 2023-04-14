import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Hotel } from '../interfaces/hotel';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private url: string;
  private api: string;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/hotels/';
  }

  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.url}${this.api}`);
  }

  getById(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.url}${this.api}${id}`);
  }

  addHotel(hotel: Hotel): Observable<Hotel> {
    return this.http.post<Hotel>(`${this.url}${this.api}`, hotel);
  }

  updateHotel(hotel: Hotel): Observable<void> {
    console.log(hotel.id)
    return this.http.put<void>(`${this.url}${this.api}${hotel.id}`, hotel);
  }

  deleteHotel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.api}${id}`);
  }
}
