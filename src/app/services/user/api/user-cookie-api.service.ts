import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCookieRo } from 'common/ro/dataCookie/user-cookie.ro';
import { SaveDataCookieDTO } from 'common/dto/dataCookie/save-data-cookie.dto';
import { LatestChatIdDTO } from 'common/dto/dataCookie/latest-chat-id.dto';
import { FrontendConstants } from '../../../../constants/frontend.constants';

@Injectable({
  providedIn: 'root',
})
export class UserCookieApiService {
  constructor(private client: HttpClient) {}

  public saveUserCookie(dto: SaveDataCookieDTO): Observable<UserCookieRo> {
    return this.client.post<UserCookieRo>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.DATA_COOKIE.SAVE}`,
      dto,
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
    dto: LatestChatIdDTO
  ): Observable<UserCookieRo | null> {
    return this.client.post<UserCookieRo | null>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.DATA_COOKIE.SET_LATEST_CHAT}`,
      dto,
      { withCredentials: true }
    );
  }
}
