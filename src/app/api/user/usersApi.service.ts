import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonDto, CommonRo } from '../../../../../common';
import { Observable } from 'rxjs';
import { FrontendConstants } from '../../../constants';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  constructor(private client: HttpClient) {}

  public login(
    credentials: CommonDto.UserDto.LoginDto
  ): Observable<CommonRo.UserRo.UserResponse> {
    return this.client.post<CommonRo.UserRo.UserResponse>(
      FrontendConstants.ApiEndpoint.BASE +
        FrontendConstants.ApiEndpoint.AUTH.LOGIN,
      credentials,
      {
        withCredentials: true,
      }
    );
  }

  public register(
    credentials: CommonDto.UserDto.RegisterDto
  ): Observable<CommonRo.UserRo.UserResponse> {
    return this.client.post<CommonRo.UserRo.UserResponse>(
      FrontendConstants.ApiEndpoint.BASE +
        FrontendConstants.ApiEndpoint.AUTH.REGISTER,
      credentials,
      {
        withCredentials: true,
      }
    );
  }

  public getPaginatedChats(
    userName: string,
    page: number,
    pageSize: number
  ): Observable<{ chats: string[]; total: number }> {
    return this.client.get<{ chats: string[]; total: number }>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.USERS.PAGINATED_CHATS}?userName=${userName}&page=${page}&pageSize=${pageSize}`,
      {
        withCredentials: true,
      }
    );
  }

  public getPaginatedUsers(
    dto: CommonDto.ContactDto.GetContactsDto
  ): Observable<{ users: CommonRo.UserRo.UserResponse[]; total: number }> {
    return this.client.get<{
      users: CommonRo.UserRo.UserResponse[];
      total: number;
    }>(
      `${FrontendConstants.ApiEndpoint.BASE}/users/paginated-users?userName=${dto.userName}&page=${dto.page}&pageSize=${dto.limit}`,
      { withCredentials: true }
    );
  }

  public updateUser(
    profile: CommonDto.UserDto.UserUpdateDto
  ): Observable<CommonRo.UserRo.UserResponse> {
    return this.client.put<CommonRo.UserRo.UserResponse>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.USERS.UPDATE}`,
      profile,
      { withCredentials: true }
    );
  }

  public logOut(): Observable<void> {
    return this.client.post<void>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.AUTH.LOGOUT}`,
      {},
      {
        withCredentials: true,
      }
    );
  }
}
