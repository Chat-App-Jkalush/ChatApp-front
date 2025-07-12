import { Component, OnInit } from '@angular/core';
import { UsersApiService } from '../../../../api/usersApi.service';

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

  constructor(private usersApiService: UsersApiService) {}

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
      .getPaginatedUsers(this.pageIndex + 1, this.pageSize)
      .subscribe((res) => {
        this.users = res.users;
        this.totalUsers = res.total;
      });
    console.log('Loaded users:', this.users);
  }

  addContact(userName: string) {
    console.log('Add contact:', userName);
  }
}
