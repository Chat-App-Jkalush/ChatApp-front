import { Component, OnInit } from '@angular/core';
import { UsersApiService } from '../../../../api/usersApi.service';
import { ContactApiService } from '../../../../api/contactApi.service';
import { RefreshDataService } from '../../../../services/refreshData.service';

@Component({
  selector: 'app-add-contacts',
  standalone: false,
  templateUrl: './add-contacts.component.html',
  styleUrls: ['./add-contacts.component.scss'],
})
export class AddContactsComponent implements OnInit {
  public users: any[] = [];
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
      .getPaginatedUsers(
        this.refreshDataService.userName,
        this.pageIndex + 1,
        this.pageSize
      )
      .subscribe((res: { users: any[]; total: number }) => {
        this.users = res.users;
        this.totalUsers = res.total;
      });
  }

  public addContact(userName: string): void {
    this.contactApi
      .addContact(this.refreshDataService.userName, userName)
      .subscribe({
        next: (res: any): void => {
          console.log('Contact added successfully:', res);
          this.users = this.users.filter(
            (user: any) => user.userName !== userName
          );
        },
        error: (err: any): void => {
          console.error('Error adding contact:', err);
        },
      });
  }
}
