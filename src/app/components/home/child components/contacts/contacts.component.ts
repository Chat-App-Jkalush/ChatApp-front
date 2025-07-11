import { Component, OnInit } from '@angular/core';
import { UsersApiService } from '../../../../api/usersApi.service';
import { UserService } from '../../../../services/user.service';
import { ContactApiService } from '../../../../api/contactApi.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  standalone: false,
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  userName = '';
  contacts: string[] = [];
  totalContacts = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private contactApi: ContactApiService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userName = this.userService.userName;
    this.loadContacts();
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadContacts();
  }

  loadContacts() {
    this.contactApi
      .getPaginatedContacts(this.userName, this.pageIndex + 1, this.pageSize)
      .subscribe((res) => {
        this.contacts = res.contacts;
        this.totalContacts = res.total;
      });
  }
}
