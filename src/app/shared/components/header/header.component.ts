import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { routes } from 'app/app.routes';
import { User } from 'app/shared/interfaces/user';
import { AuthService } from 'app/shared/services/auth.service';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { TitleService } from 'app/shared/services/title.service';
import { Subscription } from 'rxjs';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, BreadcrumbComponent, SidebarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  routes: Routes = routes;
  profileOpen: boolean;
  isLogged: boolean;
  pageTitle: string;
  userName: string = '';
  userImage: string = '';
  private titleSubscription: Subscription;
  constructor(
    private router: Router,
    private authService: AuthService,
    private titleService: TitleService,
  ) {}
  ngOnDestroy(): void {
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.profileOpen = false;
    this.routes = this.router.config.filter(
      (route) => route.path !== 'login' && route.path,
    );
    this.isLogged = this.authService.isAuthenticatedUser();
    this.titleSubscription = this.titleService.pageTitle$.subscribe(
      (title) => (this.pageTitle = title),
    );
    this.getLoggedUser();
  }

  toggleProfile = () => (this.profileOpen = !this.profileOpen);
  logout = () => {
    this.router.navigate(['/login']);
    this.authService.logout();
  };
  getLoggedUser = () => {
    const { image, username } =
      this.authService.getTokenContent<User>() ?? ({} as User);
    this.userName = username;
    this.userImage = image;
  };
}
