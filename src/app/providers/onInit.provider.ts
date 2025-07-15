import { APP_INITIALIZER, Provider } from '@angular/core';
import { UserCookieApiService } from '../api/userCookieApi.service';
import { RefreshDataService } from '../services/refreshData.service';

export function onInit(
  userCookieApi: UserCookieApiService,
  refreshDataService: RefreshDataService
) {
  return () => {
    console.log('[APP_INITIALIZER] onInit called');
    if (typeof document === 'undefined') {
      console.log('[APP_INITIALIZER] Not running in browser, skipping.');
      return Promise.resolve();
    }
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];
    console.log('[APP_INITIALIZER] Cookie:', cookie);
    if (cookie) {
      return userCookieApi
        .getUserCookie(cookie)
        .toPromise()
        .then((data) => {
          console.log('[APP_INITIALIZER] User cookie data:', data);
          if (data?.userDetails?.userName) {
            refreshDataService.setUserName(data.userDetails.userName);
            console.log(
              '[APP_INITIALIZER] Set userName:',
              data.userDetails.userName
            );
          }
          if (data?.userDetails?.latestChatId) {
            refreshDataService.setLatestChatId(data.userDetails.latestChatId);
            console.log(
              '[APP_INITIALIZER] Set latestChatId:',
              data.userDetails.latestChatId
            );
          }
          if (data?.userDetails?.chats) {
            refreshDataService.setChats(data.userDetails.chats);
            console.log('[APP_INITIALIZER] Set chats:', data.userDetails.chats);
          }
        });
    }
    console.log('[APP_INITIALIZER] No cookie found, skipping user init.');
    return Promise.resolve();
  };
}
export const OnInitProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: onInit,
  deps: [UserCookieApiService, RefreshDataService],
  multi: true,
};
