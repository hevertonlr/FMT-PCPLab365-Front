import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}users`;
  constructor(private http: HttpClient) {}

  getUsers = (): Observable<User[]> => this.http.get<User[]>(this.API_URL);

  getUser = (email: string): Observable<User> =>
    this.http.get<User>(this.API_URL + `?email=${encodeURIComponent(email)}`);
}
