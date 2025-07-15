import { APP_INITIALIZER, Provider } from '@angular/core';
import { UserCookieApiService } from '../api/userCookieApi.service';
import { RefreshDataService } from '../services/refreshData.service';

export function onInit(
  userCookieApi: UserCookieApiService,
  refreshDataService: RefreshDataService
) {
  return () => {
    if (typeof document === 'undefined') {
      return Promise.resolve();
    }
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];
    if (cookie) {
      return userCookieApi
        .getUserCookie(cookie)
        .toPromise()
        .then((data) => {
          if (data?.userDetails?.userName) {
            refreshDataService.setUserName(data.userDetails.userName);
          }
          if (data?.userDetails?.latestChatId) {
            refreshDataService.setLatestChatId(data.userDetails.latestChatId);
          }
          if (data?.userDetails?.chats) {
            refreshDataService.setChats(data.userDetails.chats);
          }
        });
    }
    return Promise.resolve();
  };
}
export const OnInitProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: onInit,
  deps: [UserCookieApiService, RefreshDataService],
  multi: true,
};
