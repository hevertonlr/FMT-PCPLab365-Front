import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, forkJoin, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseService<T> {
  public API_URL = `${environment.apiUrl}`;
  constructor(protected http: HttpClient) {}

  getOne = (id: string): Observable<T> =>
    this.http.get<T>(this.API_URL + `/${id}`);

  getAll = (): Observable<T[]> =>
    this.http.get<T[]>(this.API_URL).pipe(catchError(this.handleError));

  getAllBy = (
    field: string,
    value: string,
    expand?: string[],
  ): Observable<T[]> => {
    const expands = expand
      ? expand.map((exp) => `&_expand=${exp}`).join('')
      : '';
    const endpoint =
      this.API_URL + `?${field}=${encodeURIComponent(value)}${expands}`;
    return this.http.get<T[]>(endpoint).pipe(catchError(this.handleError));
  };

  getAllByIds = (ids: string[]): Observable<T[]> =>
    forkJoin(ids.map((id) => this.getOne(id)));

  findBy = (field: string, value: string): Observable<T> =>
    this.http
      .get<T>(this.API_URL + `?${field}=${encodeURIComponent(value)}`)
      .pipe(catchError(this.handleError));

  getCount = (): Observable<number> =>
    this.getAll()
      .pipe(map((items) => items.length))
      .pipe(catchError(this.handleError));

  create = (item: T): Observable<T> =>
    this.http
      .post<T>(this.API_URL, JSON.stringify(item))
      .pipe(catchError(this.handleError));

  update = (id: string, item: T): Observable<T> =>
    this.http
      .put<T>(`${this.API_URL}/${id}`, JSON.stringify(item))
      .pipe(catchError(this.handleError));

  delete = (id: string): Observable<void> =>
    this.http
      .delete<void>(`${this.API_URL}/${id}`)
      .pipe(catchError(this.handleError));

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => 'Something went wrong. Please try again later.');
  }
}
