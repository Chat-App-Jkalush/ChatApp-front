import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginDto } from '../../../../../common/dto/user.dto';
import { UsersApiService } from '../../api/usersApi.service';
import { Router } from '@angular/router';
import { RefreshDataService } from '../../services/refreshData.service';
import { UserCookieApiService } from '../../api/userCookieApi.service';
// ...existing imports...

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
      next: (response: any) => {
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
