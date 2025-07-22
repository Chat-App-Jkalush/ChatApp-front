import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDto } from 'common/dto/user/login.dto';
import { RegisterDto } from 'common/dto/user/register.dto';
import { UserUpdateDto } from 'common/dto/user/update-user.dto';
import { UserResponse } from 'common/ro/user/user-response.ro';
import { Observable } from 'rxjs';
import { FrontendConstants } from '../../../../constants/frontend.constants';
import { GetPaginatedChatsDto } from 'common/dto/chat/get-paginated-chats.dto';
import { GetPaginatedUsersDto } from 'common/dto/user/get-paginated-users.dto';
import { PaginatedChatsRo } from 'common/ro/chat/paginated-chats.ro';
import { PaginatedUsersRo } from 'common/ro/user/paginated-users.ro';

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
    dto: GetPaginatedChatsDto
  ): Observable<PaginatedChatsRo> {
    let url = `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.USERS.PAGINATED_CHATS}?userName=${dto.userName}&page=${dto.page}&pageSize=${dto.pageSize}`;
    return this.client.get<PaginatedChatsRo>(url, { withCredentials: true });
  }

  public getPaginatedUsers(
    dto: GetPaginatedUsersDto
  ): Observable<PaginatedUsersRo> {
    let url = `${FrontendConstants.ApiEndpoint.BASE}/users/paginated-users?userName=${dto.userName}&page=${dto.page}&pageSize=${dto.pageSize}`;
    if (dto.search) {
      url += `&search=${encodeURIComponent(dto.search)}`;
    }
    return this.client.get<PaginatedUsersRo>(url, { withCredentials: true });
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
