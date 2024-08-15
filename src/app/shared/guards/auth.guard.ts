import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Profile } from '../enums/profile';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    if (!this.authService.isAuthenticatedUser())
      this.router.navigate(['/login']);

    const user = this.authService.getCurrentUser();

    const allowedProfiles: Profile[] = route.data['allowedProfiles'];
    if (!allowedProfiles || allowedProfiles.includes(user.profile)) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
