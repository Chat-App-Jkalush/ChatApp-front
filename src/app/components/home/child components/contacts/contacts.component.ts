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
  public userName: string = '';
  public contacts: string[] = [];
  public totalContacts: number = 0;
  public pageSize: number = 10;
  public pageIndex: number = 0;
  public onlineMap: { [contact: string]: boolean } = {};
  private onlineStatusListener:
    | ((data: { userName: string; isOnline: boolean }) => void)
    | null = null;
  private isInitialized: boolean = false;

  constructor(
    private contactApi: ContactApiService,
    private refreshDataService: RefreshDataService,
    private chatSocket: ChatSocketService
  ) {}

  public ngOnInit(): void {
    this.userName = this.refreshDataService.userName;
    this.setupOnlineStatusListener();
    this.initializeComponent();
  }

  public ngOnDestroy(): void {
    this.removeOnlineStatusListener();
  }

  private setupOnlineStatusListener(): void {
    this.removeOnlineStatusListener();

    this.onlineStatusListener = (data: {
      userName: string;
      isOnline: boolean;
    }): void => {
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

  public onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadContacts();
  }

  public loadContacts(): void {
    this.contactApi
      .getPaginatedContacts(this.userName, this.pageIndex + 1, this.pageSize)
      .subscribe((res: any) => {
        this.contacts = res.contacts.map((c: any) =>
          typeof c === 'string' ? c : c.contactName
        );
        this.totalContacts = res.total;
        this.setOnlineStatus();
      });
  }

  public setOnlineStatus(): void {
    if (this.contacts.length === 0) return;

    const contactNames: string[] = this.contacts.map((c: any) =>
      typeof c === 'string' ? c : c.contactName
    );

    this.chatSocket
      .getOnlineContacts(contactNames)
      .then((onlineContacts: string[]) => {
        contactNames.forEach((contact: string) => {
          this.onlineMap[contact] = onlineContacts.includes(contact);
        });

        console.log('Initial online status set:', this.onlineMap);
      });
  }

  public removeContact(contactName: string): void {
    this.contacts = this.contacts.filter(
      (contact: string) => contact !== contactName
    );
    this.totalContacts = this.contacts.length;
    delete this.onlineMap[contactName];
  }
}
