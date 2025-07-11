import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINT } from '../../../constants/api.constatns';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserCookieApiService {
  constructor(private client: HttpClient) {}

  saveUserCookie(userDetails: any, cookie: string): Observable<any> {
    return this.client.post(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.USER_COOKIE.SAVE}`,
<<<<<<< HEAD
      { ...userDetails, cookie },
=======
      { userDetails, cookie },
>>>>>>> origin/master
      { withCredentials: true }
    );
  }

  getUserCookie(cookie: string): Observable<any> {
    return this.client.get(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.USER_COOKIE.GET}?cookie=${cookie}`,
      { withCredentials: true }
    );
  }
}
