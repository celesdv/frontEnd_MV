import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client } from '../interfaces/client';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private url: string;
  private api: string;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/clients/';
  }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.url}${this.api}`);
  }

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.url}${this.api}${id}`);
  }

  addClient(client: Client): Observable<void> {
    return this.http.post<void>(`${this.url}${this.api}`, client);
  }

  updateClient(client: Client): Observable<void> {
    return this.http.put<void>(`${this.url}${this.api}${client.id}`, client);
  }

  deleteClient(id: number,): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.api}${id}`);
  }
}
