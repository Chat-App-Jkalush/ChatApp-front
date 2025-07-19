import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RefreshDataService } from '../../../../services/refreshData.service';
import { Router } from '@angular/router';
import { UsersApiService } from '../../../../api/user/usersApi.service';

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
      userName: [
        this.refreshDataService.userName,
        [Validators.required, Validators.pattern(/\S+/)],
      ],
      firstName: ['', [Validators.pattern(/\S+/)]],
      lastName: ['', [Validators.pattern(/\S+/)]],
      password: ['', [Validators.minLength(6)]],
    });
  }

  public onSubmit(): void {
    if (this.settingsForm.get('userName')?.invalid) return;
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';
    const formValue = this.settingsForm.value;
    const updatePayload: any = { userName: formValue.userName };
    if (formValue.firstName && formValue.firstName.trim() !== '') {
      updatePayload.firstName = formValue.firstName;
    }
    if (formValue.lastName && formValue.lastName.trim() !== '') {
      updatePayload.lastName = formValue.lastName;
    }
    if (formValue.password && formValue.password.trim() !== '') {
      updatePayload.password = formValue.password;
    }
    this.usersApi.updateUser(updatePayload).subscribe({
      next: (): void => {
        this.successMessage = 'Profile updated successfully!';
        this.loading = false;
        this.refreshDataService.setUserName(updatePayload.userName);
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
