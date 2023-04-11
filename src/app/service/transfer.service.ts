import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Transfer } from '../interfaces/transfer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransferService {
  private url: string;
  private api: string;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/transfers/';
  }

  getTransfers(): Observable<Transfer[]> {
    return this.http.get<Transfer[]>(`${this.url}${this.api}`);
  }

  getById(id: number): Observable<Transfer> {
    return this.http.get<Transfer>(`${this.url}${this.api}${id}`);
  }

  getByBudget(id: number): Observable<Transfer[]> {
    return this.http.get<Transfer[]>(`${this.url}${this.api}budget/${id}`);
  }

  addTransfer(transfer: Transfer): Observable<void> {
    return this.http.post<void>(`${this.url}${this.api}`, transfer);
  }

  updateTransfer(transfer: Transfer): Observable<void> {
    return this.http.put<void>(`${this.url}${this.api}${transfer.id}`, transfer);
  }

  deleteTransfer(id: number,): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.api}${id}`);
  }
}
