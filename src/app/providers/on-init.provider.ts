import { APP_INITIALIZER, Provider } from '@angular/core';
import { UserCookieApiService } from 'app/services/user/api/user-cookie-api.service';
import { RefreshDataService } from '../services/refresh/refresh-data.service';

export function onInit(
  userCookieApi: UserCookieApiService,
  refreshDataService: RefreshDataService
) {
  return () => {
    if (typeof document === 'undefined') {
      return Promise.resolve();
    }
    return userCookieApi
      .getUserCookie()
      .toPromise()
      .then((data) => {
        if (data?.userName) {
          refreshDataService.setUserName(data.userName);
        }
      })
      .catch(() => {});
  };
}

export const OnInitProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: onInit,
  deps: [UserCookieApiService, RefreshDataService],
  multi: true,
};
