import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINT } from '../../../constants/api.constatns';
import { Observable } from 'rxjs';
import { CommonRo } from '../../../../../common/Ro/common.ro';

@Injectable({
  providedIn: 'root',
})
export class UserCookieApiService {
  constructor(private client: HttpClient) {}

  public saveUserCookie(
    userDetails: { userName: string },
    latestChatId?: string
  ): Observable<CommonRo.DataCookie.UserCookieRo> {
    return this.client.post<CommonRo.DataCookie.UserCookieRo>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.DATA_COOKIE.SAVE}`,
      { ...userDetails, latestChatId },
      { withCredentials: true }
    );
  }

  public getUserCookie(): Observable<CommonRo.DataCookie.UserCookieRo> {
    return this.client.get<CommonRo.DataCookie.UserCookieRo>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.DATA_COOKIE.GET}`,
      { withCredentials: true }
    );
  }

  public setLatestChatId(
    userName: string,
    latestChatId: string
  ): Observable<CommonRo.DataCookie.UserCookieRo | null> {
    return this.client.post<CommonRo.DataCookie.UserCookieRo | null>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.DATA_COOKIE.SET_LATEST_CHAT}`,
      { userName, latestChatId },
      { withCredentials: true }
    );
  }
}
