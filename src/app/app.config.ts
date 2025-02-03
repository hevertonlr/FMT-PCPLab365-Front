import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { PageTitleStrategy } from './shared/strategies/page-title.strategy';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { provideIcons } from '@ng-icons/core';
import {
  heroArrowTrendingUp,
  heroCog6Tooth,
  heroEnvelope,
  heroEye,
  heroFolder,
  heroHomeModern,
  heroIdentification,
  heroPencil,
  heroPencilSquare,
  heroPhone,
  heroTrash,
  heroUsers,
} from '@ng-icons/heroicons/outline';
import {
  heroCheckCircleSolid,
  heroExclamationCircleSolid,
  heroTrashSolid,
  heroUserCircleSolid,
} from '@ng-icons/heroicons/solid';
import { heroPencilMini, heroTrashMini } from '@ng-icons/heroicons/mini';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideEnvironmentNgxMask(),
    provideAnimations(),
    provideIcons({
      heroUsers,
      heroFolder,
      heroArrowTrendingUp,
      heroEnvelope,
      heroHomeModern,
      heroCog6Tooth,
      heroUserCircleSolid,
      heroCheckCircleSolid,
      heroExclamationCircleSolid,
      heroIdentification,
      heroTrash,
      heroTrashSolid,
      heroTrashMini,
      heroPencil,
      heroPencilSquare,
      heroPencilMini,
      heroEye,
      heroPhone,
    }),
    {
      provide: TitleStrategy,
      useClass: PageTitleStrategy,
    },
  ],
};
