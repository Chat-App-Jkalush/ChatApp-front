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
}
