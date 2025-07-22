import { Component, OnInit } from '@angular/core';
import { ContactApiService } from '../../../../api/contact/contact-api.service';
import { RefreshDataService } from '../../../../services/refresh/refresh-data.service';
import { UsersApiService } from '../../../../api/user/users-api.service';
import { UserResponse } from 'common/ro/user/user-response.ro';
import { User } from 'common/ro/user/user.ro';

@Component({
  selector: 'app-add-contacts',
  standalone: false,
  templateUrl: './add-contacts.component.html',
  styleUrls: ['./add-contacts.component.scss'],
})
export class AddContactsComponent implements OnInit {
  public users: UserResponse[] = [];
  public totalUsers: number = 0;
  public pageSize: number = 10;
  public pageIndex: number = 0;

  constructor(
    private usersApiService: UsersApiService,
    private refreshDataService: RefreshDataService,
    private contactApi: ContactApiService
  ) {}

  public ngOnInit(): void {
    this.loadUsers();
  }

  public onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  public loadUsers(): void {
    this.usersApiService
      .getPaginatedUsers({
        userName: this.refreshDataService.userName,
        page: this.pageIndex + 1,
        limit: this.pageSize,
      })
      .subscribe((res: { users: UserResponse[]; total: number }) => {
        this.users = res.users;
        this.totalUsers = res.total;
      });
  }

  public addContact(userName: string): void {
    this.contactApi
      .addContact(this.refreshDataService.userName, userName)
      .subscribe({
        next: (res: User): void => {
          console.log('Contact added successfully:', res);
          this.users = this.users.filter(
            (user: UserResponse) => user.userName !== userName
          );
        },
        error: (err: any): void => {
          console.error('Error adding contact:', err);
        },
      });
  }
}
