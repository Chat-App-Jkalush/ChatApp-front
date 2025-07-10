import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersApiService } from '../../api/usersApi.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  constructor(private fb: FormBuilder, private userApi: UsersApiService) {}
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
        console.log('Registration successful:', response);
      },
      error: (error) => {
        console.error('Registration failed:', error);
      },
    });
  }
}
