import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDto } from '../../../../common/dto/user.dto';
import { Observable } from 'rxjs';
import { UserResponse } from '../../../../common/Ro/user.ro';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  constructor(private client: HttpClient) {}

  login(credentials: LoginDto): Observable<UserResponse> {
    return this.client.post<UserResponse>(
      'http://localhost:3000/auth/login',
      credentials,
      {
        withCredentials: true,
      }
    );
  }
}
