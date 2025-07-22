import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginDto } from 'common/dto/user/login.dto';
import { UserResponse } from 'common/ro/user/user-response.ro';
import { Router } from '@angular/router';
import { RefreshDataService } from '../../services/refresh/refresh-data.service';
import { UserCookieApiService } from '../../api/user/user-cookie-api.service';
import { UsersApiService } from '../../api/user/users-api.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userApi: UsersApiService,
    private userCookieApi: UserCookieApiService,
    private router: Router,
    private refreshDataService: RefreshDataService
  ) {}

  public ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.userApi.login(this.loginForm.value as LoginDto).subscribe({
      next: (response: UserResponse) => {
        this.refreshDataService.setUserName(response.userName);

        this.userCookieApi
          .saveUserCookie({ userName: response.userName })
          .subscribe({
            next: (): void => {
              this.router.navigate(['/home']);
            },
            error: (error: any): void => {
              console.error('Failed to save user cookie:', error);
              this.router.navigate(['/home']);
            },
          });
      },
      error: (error: any): void => {
        console.error('Login failed:', error);
      },
    });
  }
}
