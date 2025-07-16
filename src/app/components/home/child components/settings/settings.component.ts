import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersApiService } from '../../../../api/usersApi.service';
import { RefreshDataService } from '../../../../services/refreshData.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  public settingsForm!: FormGroup;
  public loading: boolean = false;
  public successMessage: string = '';
  public errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private usersApi: UsersApiService,
    private refreshDataService: RefreshDataService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.settingsForm = this.fb.group({
      userName: [this.refreshDataService.userName, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public onSubmit(): void {
    if (this.settingsForm.invalid) return;
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.usersApi.updateUser(this.settingsForm.value).subscribe({
      next: (): void => {
        this.successMessage = 'Profile updated successfully!';
        this.loading = false;
        this.refreshDataService.setUserName(this.settingsForm.value.userName);
      },
      error: (err: any): void => {
        this.errorMessage = 'Failed to update profile.';
        this.loading = false;
      },
    });
  }

  public logout(): void {
    this.usersApi.logOut().subscribe({
      next: (): void => {
        this.router.navigate(['/login']);
      },
    });
  }
}
