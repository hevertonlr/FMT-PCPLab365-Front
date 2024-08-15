import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private pageTitleSubject = new BehaviorSubject<string>('');
  pageTitle$ = this.pageTitleSubject.asObservable();
  constructor(
    private router: Router,
    private title: Title,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let currentPage = this.router.config.find(
          (route) => route.path === this.router.url.replace('/', ''),
        );
        const pageTitle =
          currentPage && typeof currentPage.title === 'string'
            ? currentPage.title
            : '';
        this.pageTitleSubject.next(pageTitle);
        this.title.setTitle(pageTitle);
      });
  }
}
