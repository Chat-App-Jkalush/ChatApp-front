import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  LoginDto,
  RegisterDto,
  UserUpdateDto,
} from '../../../../../common/dto';
import { UserResponse } from '../../../../../common/Ro';
import { Observable } from 'rxjs';
import { FrontendConstants } from '../../../constants';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  constructor(private client: HttpClient) {}

  public login(credentials: LoginDto): Observable<UserResponse> {
    return this.client.post<UserResponse>(
      FrontendConstants.ApiEndpoint.BASE +
        FrontendConstants.ApiEndpoint.AUTH.LOGIN,
      credentials,
      {
        withCredentials: true,
      }
    );
  }

  public register(credentials: RegisterDto): Observable<UserResponse> {
    return this.client.post<UserResponse>(
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

  public getPaginatedUsers(dto: {
    userName: string;
    page: number;
    limit: number;
  }): Observable<{ users: UserResponse[]; total: number }> {
    return this.client.get<{
      users: UserResponse[];
      total: number;
    }>(
      `${FrontendConstants.ApiEndpoint.BASE}/users/paginated-users?userName=${dto.userName}&page=${dto.page}&pageSize=${dto.limit}`,
      { withCredentials: true }
    );
  }

  public updateUser(profile: UserUpdateDto): Observable<UserResponse> {
    return this.client.put<UserResponse>(
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
