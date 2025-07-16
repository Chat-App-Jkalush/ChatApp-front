import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContactApiService } from '../../../../api/contactApi.service';
import { RefreshDataService } from '../../../../services/refreshData.service';
import { ChatSocketService } from '../../../../services/chatSocket.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  standalone: false,
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit, OnDestroy {
  userName = '';
  contacts: string[] = [];
  totalContacts = 0;
  pageSize = 10;
  pageIndex = 0;
  onlineMap: { [contact: string]: boolean } = {};
  private onlineStatusListener: any;
  private isInitialized = false;

  constructor(
    private contactApi: ContactApiService,
    private refreshDataService: RefreshDataService,
    private chatSocket: ChatSocketService
  ) {}

  ngOnInit(): void {
    this.userName = this.refreshDataService.userName;
    this.setupOnlineStatusListener();
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.removeOnlineStatusListener();
  }

  private setupOnlineStatusListener(): void {
    this.removeOnlineStatusListener();

    this.onlineStatusListener = (data: {
      userName: string;
      isOnline: boolean;
    }) => {
      if (this.contacts.includes(data.userName)) {
        this.onlineMap[data.userName] = data.isOnline;
        console.log(
          `Contact ${data.userName} is now ${
            data.isOnline ? 'online' : 'offline'
          }`
        );
      }
    };

    this.chatSocket.onEvent('contactOnlineStatus', this.onlineStatusListener);
  }

  private removeOnlineStatusListener(): void {
    if (this.onlineStatusListener) {
      this.chatSocket
        .getSocket()
        .off('contactOnlineStatus', this.onlineStatusListener);
      this.onlineStatusListener = null;
    }
  }

  private async initializeComponent(): Promise<void> {
    await this.ensureUserJoinedChats();
    this.loadContacts();
    this.isInitialized = true;
  }

  private ensureUserJoinedChats(): Promise<void> {
    return new Promise((resolve) => {
      if (this.chatSocket.getSocket().connected) {
        this.chatSocket.joinChats(this.userName);
        setTimeout(() => resolve(), 100);
      } else {
        this.chatSocket.getSocket().once('connect', () => {
          this.chatSocket.joinChats(this.userName);
          setTimeout(() => resolve(), 100);
        });
      }
    });
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
        this.contacts = res.contacts.map((c: any) =>
          typeof c === 'string' ? c : c.contactName
        );
        this.totalContacts = res.total;
        this.setOnlineStatus();
      });
  }

  setOnlineStatus() {
    if (this.contacts.length === 0) return;

    const contactNames = this.contacts.map((c: any) =>
      typeof c === 'string' ? c : c.contactName
    );

    this.chatSocket.getOnlineContacts(contactNames).then((onlineContacts) => {
      contactNames.forEach((contact) => {
        this.onlineMap[contact] = onlineContacts.includes(contact);
      });

      console.log('Initial online status set:', this.onlineMap);
    });
  }

  removeContact(contactName: string) {
    this.contacts = this.contacts.filter((contact) => contact !== contactName);
    this.totalContacts = this.contacts.length;
    delete this.onlineMap[contactName];
  }
}
