import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINT } from '../../constants/api.constatns';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserCookieApiService {
  constructor(private client: HttpClient) {}

  saveUserCookie(userDetails: any, latestChatId?: string): Observable<any> {
    return this.client.post(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.DATA_COOKIE.SAVE}`,
      { ...userDetails, latestChatId },
      { withCredentials: true }
    );
  }

  getUserCookie(): Observable<any> {
    return this.client.get(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.DATA_COOKIE.GET}`,
      { withCredentials: true }
    );
  }

  setLatestChatId(userName: string, latestChatId: string): Observable<any> {
    return this.client.post(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.DATA_COOKIE.SET_LATEST_CHAT}`,
      { userName, latestChatId },
      { withCredentials: true }
    );
  }
}
