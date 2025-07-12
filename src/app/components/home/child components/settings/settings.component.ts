import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersApiService } from '../../../../api/usersApi.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  settingsForm!: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private usersApi: UsersApiService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      userName: [this.userService.userName, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.settingsForm.invalid) return;
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.usersApi.updateUser(this.settingsForm.value).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully!';
        this.loading = false;
        this.userService.setUserName(this.settingsForm.value.userName);
      },
      error: (err) => {
        this.errorMessage = 'Failed to update profile.';
        this.loading = false;
      },
    });
  }
}
