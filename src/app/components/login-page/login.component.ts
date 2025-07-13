import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginDto } from '../../../../../common/dto/user.dto';
import { UsersApiService } from '../../api/usersApi.service';
import { Router } from '@angular/router';
import { RefreshDataService } from '../../services/refreshData.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userApi: UsersApiService,
    private router: Router,
    private refreshDataService: RefreshDataService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.userApi.login(this.loginForm.value as LoginDto).subscribe({
      next: (response) => {
        this.refreshDataService.setUserName(response.userName);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }
}
