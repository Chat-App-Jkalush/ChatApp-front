import { Component, OnInit } from '@angular/core';
import { UsersApiService } from '../../../../api/usersApi.service';
import { UserService } from '../../../../services/user.service';
import { ContactApiService } from '../../../../api/contactApi.service';

@Component({
  selector: 'app-add-contacts',
  standalone: false,
  templateUrl: './add-contacts.component.html',
  styleUrls: ['./add-contacts.component.scss'],
})
export class AddContactsComponent implements OnInit {
  users: any[] = [];
  totalUsers = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private usersApiService: UsersApiService,
    private userService: UserService,
    private contactApi: ContactApiService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  loadUsers() {
    this.usersApiService
      .getPaginatedUsers(
        this.userService.userName,
        this.pageIndex + 1,
        this.pageSize
      )
      .subscribe((res) => {
        this.users = res.users;
        this.totalUsers = res.total;
      });
  }

  addContact(userName: string) {
    this.contactApi.addContact(this.userService.userName, userName).subscribe({
      next: (res) => {
        console.log('Contact added successfully:', res);
        this.users = this.users.filter((user) => user.userName !== userName);
      },
      error: (err) => {
        console.error('Error adding contact:', err);
      },
    });
  }
}
