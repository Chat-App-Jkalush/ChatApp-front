import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersApiService } from '../../api/usersApi.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/refreshData.service';
import { UserCookieApiService } from '../../api/userCookieApi.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private userApi: UsersApiService,
    private userCookieApi: UserCookieApiService,
    private router: Router,
    private userService: UserService
  ) {}
  registerForm!: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.userApi.register(this.registerForm.value).subscribe({
      next: (response) => {
        const cookie = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1];
        if (cookie) {
          this.userCookieApi.saveUserCookie(response, cookie).subscribe({
            next: () => {
              this.userService.setUserName(response.userName);
              this.router.navigate(['/home']);
            },
            error: (error) => {
              console.error('Failed to save user cookie:', error);
              this.userService.setUserName(response.userName);
              this.router.navigate(['/home']);
            },
          });
        } else {
          this.userService.setUserName(response.userName);
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        console.error('Registration failed:', error);
      },
    });
  }
}
