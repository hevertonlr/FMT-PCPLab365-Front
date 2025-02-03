import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import sign from 'jwt-encode';
import { UserService } from './user.service';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { environment } from 'environments/environment';
import { User } from '../interfaces/user';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'fmt-m2-educationportalapp';
  private readonly PRIVATE_KEY = environment.privateKey;
  private readonly PUBLIC_KEY = environment.publicKey;
  public API_URL = `${environment.apiBackURl}login`;
  private isAuthenticated = false;
  constructor(
    private userService: UserService,
    protected http: HttpClient,
  ) {
    this.isAuthenticated = !!sessionStorage.getItem(this.TOKEN_KEY);
  }
  logout = (): void => this.clearToken();
  isAuthenticatedUser = (): boolean => this.isAuthenticated;
  login = (user: string, password: string): Observable<boolean> => {
    return this.http
      .post<{ token: string }>(this.API_URL, { user, password })
      .pipe(
        switchMap((response) => {
          if (response && response.token) {
            this.setToken(response.token);
            const { sub } =
            this.getTokenContent<JwtPayload>() ?? ({} as JwtPayload);

            if (!sub) return of(false);
            return this.userService.getOne(sub).pipe(
              map((user) => {
                this.setCurrentUser(user);
                return true;
              })
            );
          }
          return of(false);
        }),
        catchError(() => of(false)),
      );
  };

  generateJwtToken = (payload: Object) =>
    sign(payload, this.PRIVATE_KEY, { algorithm: 'RS256' });
  getTokenContent = <T>(suffix?:string) => {
    const storageContent = sessionStorage.getItem(this.TOKEN_KEY+(suffix??''));
    if (!storageContent) return null;
    return this.readJwtToken<T>(storageContent);
  };
  
  getToken = (): string | null =>
    sessionStorage.getItem(this.TOKEN_KEY) ?? null;

  getCurrentUser = (): User =>
    this.getTokenContent<User>('-user') ?? ({} as User);

  private setToken = (token: string) => {
    this.isAuthenticated = true;
    sessionStorage.setItem(this.TOKEN_KEY, token);
  };

  private setCurrentUser = (user: User) => {
    const tokenUser = this.generateJwtToken(user);
    sessionStorage.setItem(this.TOKEN_KEY+'-user', tokenUser);
  };
  
  private clearToken = () => {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY+'-user');
    this.isAuthenticated = false;
  };

  private readJwtToken = <T>(token: string): T | null => {
    try {
      return jwtDecode<T>(token);
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  };
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => 'Something went wrong. Please try again later.');
  }
}
