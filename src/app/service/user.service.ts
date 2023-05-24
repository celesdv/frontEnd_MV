import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url: string;
  private api: string;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/users/';
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.url}${this.api}/login`, data);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}${this.api}`);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}${this.api}${id}`);
  }

  addUser(user: User): Observable<string> {
    return this.http.post<string>(`${this.url}${this.api}`, user);
  }

  updateUser(user: User): Observable<void> {
    return this.http.put<void>(`${this.url}${this.api}${user.id}`, user);
  }

  deleteUser(id: number,): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.api}${id}`);
  }

  updatePassword(user:User, data:any): Observable<void> {
    return this.http.put<void>(`${this.url}${this.api}${user.id}/password`, data);
  }
}
