import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDto, RegisterDto } from '../../../../common/dto/user.dto';
import { Observable } from 'rxjs';
import { UserResponse } from '../../../../common/Ro/user.ro';
import { API_ENDPOINT } from '../../../constants/api.constatns';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  constructor(private client: HttpClient) {}

  login(credentials: LoginDto): Observable<UserResponse> {
    return this.client.post<UserResponse>(
      API_ENDPOINT.BASE + API_ENDPOINT.AUTH.LOGIN,
      credentials,
      {
        withCredentials: true,
      }
    );
  }

  register(credentials: RegisterDto): Observable<UserResponse> {
    return this.client.post<UserResponse>(
      API_ENDPOINT.BASE + API_ENDPOINT.AUTH.REGISTER,
      credentials,
      {
        withCredentials: true,
      }
    );
  }

  getPaginatedChats(userName: string, page: number, pageSize: number) {
    return this.client.get<{ chats: string[]; total: number }>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.USERS.PAGINATED_CHATS}?userName=${userName}&page=${page}&pageSize=${pageSize}`,
      {
        withCredentials: true,
      }
    );
  }

  getPaginatedUsers(page: number, pageSize: number) {
    return this.client.get<{ users: any[]; total: number }>(
      `${API_ENDPOINT.BASE}/users/paginated-users?page=${page}&pageSize=${pageSize}`,
      { withCredentials: true }
    );
  }
}
