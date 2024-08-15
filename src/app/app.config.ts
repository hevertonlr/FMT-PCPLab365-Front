import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { PageTitleStrategy } from './shared/strategies/page-title.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideEnvironmentNgxMask(),
    {
      provide: TitleStrategy,
      useClass: PageTitleStrategy,
    },
  ],
};
