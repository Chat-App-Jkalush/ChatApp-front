import { Component, OnInit } from '@angular/core';
import { ContactApiService } from '../../../../api/contactApi.service';
import { RefreshDataService } from '../../../../services/refreshData.service';

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
    private refreshDataService: RefreshDataService
  ) {}

  ngOnInit(): void {
    this.userName = this.refreshDataService.userName;
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
  removeContact(contactName: string) {
    this.contacts = this.contacts.filter((contact) => contact !== contactName);
    this.totalContacts = this.contacts.length;
  }
}
