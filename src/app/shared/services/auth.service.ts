import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import sign from 'jwt-encode';
import { UserService } from './user.service';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'fmt-m2-educationportalapp';
  private readonly PRIVATE_KEY = environment.privateKey;
  private readonly PUBLIC_KEY = environment.publicKey;
  private isAuthenticated = false;
  constructor(private userService: UserService) {
    this.isAuthenticated = !!sessionStorage.getItem(this.TOKEN_KEY);
  }
  logout = (): void => this.clearToken();
  isAuthenticatedUser = (): boolean => this.isAuthenticated;
  login = (email: string, password: string): Observable<boolean> => {
    return this.userService.getUser(email).pipe(
      map((response: any) => {
        const user = response[0];
        if (user.email !== email || user.password !== password) {
          return false;
        }

        const token = this.generateJwtToken({
          id: user.id,
          username: user.username,
          email: user.email,
          image: 'assets/images/' + user.image,
          admin: user.admin,
        });
        this.setToken(token);
        return true;
      }),
      catchError(() => of(false))
    );
  };

  register(user: { username: string; password: string }): boolean {
    return true;
  }

  generateJwtToken = (payload: Object) =>
    sign(payload, this.PRIVATE_KEY, { algorithm: 'RS256' });
  getTokenContent = <T>() => {
    const storageContent = sessionStorage.getItem(this.TOKEN_KEY);
    if (!storageContent) return null;
    return this.readJwtToken<T>(storageContent);
  };
  private setToken = (token: string) => {
    this.isAuthenticated = true;
    sessionStorage.setItem(this.TOKEN_KEY, token);
  };

  private clearToken = () => {
    sessionStorage.removeItem(this.TOKEN_KEY);
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
}
