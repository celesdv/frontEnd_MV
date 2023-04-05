import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Section } from '../interfaces/section';

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  private url: string;
  private api: string;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.api = 'api/sections/';
  }

  getSection(): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.url}${this.api}`);
  }

  getById(id: number): Observable<Section> {
    return this.http.get<Section>(`${this.url}${this.api}${id}`);
  }

  addSection(section: Section): Observable<Section> {
    return this.http.post<Section>(`${this.url}${this.api}`, section);
  }

  updateSection(section: Section): Observable<void> {
    return this.http.put<void>(`${this.url}${this.api}${section.id}`, section);
  }

  deleteSection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.api}${id}`);
  }
}
