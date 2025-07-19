import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonDto, CommonRo } from '../../../../../common';
import { Observable } from 'rxjs';
import { API_ENDPOINT } from '../../../constants/api.constatns';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  constructor(private client: HttpClient) {}

  public login(
    credentials: CommonDto.UserDto.LoginDto
  ): Observable<CommonRo.UserRo.UserResponse> {
    return this.client.post<CommonRo.UserRo.UserResponse>(
      API_ENDPOINT.BASE + API_ENDPOINT.AUTH.LOGIN,
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
      API_ENDPOINT.BASE + API_ENDPOINT.AUTH.REGISTER,
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
      `${API_ENDPOINT.BASE}${API_ENDPOINT.USERS.PAGINATED_CHATS}?userName=${userName}&page=${page}&pageSize=${pageSize}`,
      {
        withCredentials: true,
      }
    );
  }

  public getPaginatedUsers(
    userName: string,
    page: number,
    pageSize: number
  ): Observable<{ users: CommonRo.UserRo.UserResponse[]; total: number }> {
    return this.client.get<{
      users: CommonRo.UserRo.UserResponse[];
      total: number;
    }>(
      `${API_ENDPOINT.BASE}/users/paginated-users?userName=${userName}&page=${page}&pageSize=${pageSize}`,
      { withCredentials: true }
    );
  }

  public updateUser(profile: {
    userName: string;
    firstName: string;
    lastName: string;
    password: string;
  }): Observable<CommonRo.UserRo.UserResponse> {
    return this.client.put<CommonRo.UserRo.UserResponse>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.USERS.UPDATE}`,
      profile,
      { withCredentials: true }
    );
  }

  public logOut(): Observable<void> {
    return this.client.post<void>(
      API_ENDPOINT.BASE + API_ENDPOINT.AUTH.LOGOUT,
      {},
      {
        withCredentials: true,
      }
    );
  }
}
