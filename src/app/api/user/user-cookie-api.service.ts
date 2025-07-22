import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCookieRo } from 'common/ro/dataCookie/user-cookie.ro';
import { FrontendConstants } from '../../../constants';

@Injectable({
  providedIn: 'root',
})
export class UserCookieApiService {
  constructor(private client: HttpClient) {}

  public saveUserCookie(
    userDetails: { userName: string },
    latestChatId?: string
  ): Observable<UserCookieRo> {
    return this.client.post<UserCookieRo>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.DATA_COOKIE.SAVE}`,
      { ...userDetails, latestChatId },
      { withCredentials: true }
    );
  }

  public getUserCookie(): Observable<UserCookieRo> {
    return this.client.get<UserCookieRo>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.DATA_COOKIE.GET}`,
      { withCredentials: true }
    );
  }

  public setLatestChatId(
    userName: string,
    latestChatId: string
  ): Observable<UserCookieRo | null> {
    return this.client.post<UserCookieRo | null>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.DATA_COOKIE.SET_LATEST_CHAT}`,
      { userName, latestChatId },
      { withCredentials: true }
    );
  }
}
