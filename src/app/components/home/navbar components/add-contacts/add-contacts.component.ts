import { Component, OnInit } from '@angular/core';
import { ContactApiService } from 'app/services/contact/api/contact-api.service';
import { RefreshDataService } from '../../../../services/refresh/refresh-data.service';
import { UsersApiService } from 'app/services/user/api/users-api.service';
import { UserResponse } from 'common/ro/user/user-response.ro';
import { User } from 'common/ro/user/user.ro';
import { ContactRo } from 'common/ro/contact/contact.ro';

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
  public searchTerm: string = '';

  constructor(
    private usersApiService: UsersApiService,
    private refreshDataService: RefreshDataService,
    private contactApiService: ContactApiService
  ) {}

  public ngOnInit(): void {
    this.loadUsers();
  }

  public onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  public onSearchTermChange(term: string): void {
    this.searchTerm = term;
  }

  public onSearchEnter(): void {
    this.pageIndex = 0;
    this.loadUsers();
  }

  public loadUsers(): void {
    this.usersApiService
      .getPaginatedUsers({
        userName: this.refreshDataService.userName,
        page: this.pageIndex + 1,
        pageSize: this.pageSize,
        search: this.searchTerm,
      })
      .subscribe((res: { users: UserResponse[]; total: number }) => {
        this.users = res.users;
        this.totalUsers = res.total;
      });
  }

  public addContact(userName: string): void {
    this.contactApiService
      .addContact({
        userName: this.refreshDataService.userName,
        contactName: userName,
      })
      .subscribe({
        next: (res: ContactRo): void => {
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
