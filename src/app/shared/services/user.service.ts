import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';
import { BaseService } from './base.service';
import { catchError, map, Observable } from 'rxjs';
import { mapProfile } from '../enums/profile';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<User> {
  constructor(protected override http: HttpClient) {
    super(http);
    this.API_URL += 'usuarios';
  }

  override getOne = (id: string): Observable<User> =>
    this.http.get<User>(this.API_URL + `/${id}`).pipe(
      map(user => ({
        ...user,
        profile: mapProfile(user.profile),
      })),
      catchError(this.handleError)
    );

  register = (item: User): Observable<User> =>
        this.http
          .post<User>(this.API_URL, JSON.stringify(item))
          .pipe(catchError(this.handleError));
}
