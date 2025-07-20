import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserCookieApiService } from '../../api/user/userCookieApi.service';
import { RefreshDataService } from '../../services/refresh/refreshData.service';
import { UsersApiService } from '../../api/user/usersApi.service';
import { CommonRo } from '../../../../../common';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userApi: UsersApiService,
    private userCookieApi: UserCookieApiService,
    private router: Router,
    private refreshDataService: RefreshDataService
  ) {}

  public ngOnInit(): void {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.userApi.register(this.registerForm.value).subscribe({
      next: (response: CommonRo.UserRo.UserResponse) => {
        this.userCookieApi
          .saveUserCookie({ userName: response.userName })
          .subscribe({
            next: (): void => {
              this.refreshDataService.setUserName(response.userName);
              this.router.navigate(['/home']);
            },
            error: (): void => {
              this.refreshDataService.setUserName(response.userName);
              this.router.navigate(['/home']);
            },
          });
      },
    });
  }
}
