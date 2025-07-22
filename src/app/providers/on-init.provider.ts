import { APP_INITIALIZER, Provider } from '@angular/core';
import { UserCookieApiService } from '../api/user/user-cookie-api.service';
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
        if (data?.chats) {
          refreshDataService.setChats(data.chats);
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
