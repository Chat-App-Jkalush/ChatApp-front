import { APP_INITIALIZER, Provider } from '@angular/core';
import { UserCookieApiService } from '../api/userCookieApi.service';
import { UserService } from '../services/user.service';

export function onInit(
  userCookieApi: UserCookieApiService,
  userService: UserService
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
            userService.setUserName(data.userDetails.userName);
          }
        });
    }
    return Promise.resolve();
  };
}

export const OnInitProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: onInit,
  deps: [UserCookieApiService, UserService],
  multi: true,
};
