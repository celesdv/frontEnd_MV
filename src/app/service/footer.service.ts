import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Organization } from '../interfaces/organization';

@Injectable({
  providedIn: 'root'
})
export class FooterService {
  private url: string;
  private api: string;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/organization/';
  }

  getData(): Observable<Organization> {
    return this.http.get<Organization>(`${this.url}${this.api}`);
  }
}
