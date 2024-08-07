import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseService<T> {
  public API_URL = `${environment.apiUrl}`;
  constructor(protected http: HttpClient) {}

  get = (): Observable<T[]> => this.http.get<T[]>(this.API_URL);

  findBy = (field: string, value: string): Observable<T> =>
    this.http.get<T>(this.API_URL + `?${field}=${encodeURIComponent(value)}`);
}
