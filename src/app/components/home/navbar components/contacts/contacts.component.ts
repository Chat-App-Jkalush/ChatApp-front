import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { ContactApiService } from 'app/services/contact/api/contact-api.service';
import { RefreshDataService } from '../../../../services/refresh/refresh-data.service';
import {
  ChatSocketService,
  OnlineStatus,
} from '../../../../services/chat/chat-socket.service';
import { ChatApiService } from 'app/services/chat/api/chat-api.service';

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
  public onlineStatuses: { [contact: string]: boolean } = {};
  public searchTerm: string = '';
  private onlineStatusSubscription: (() => void) | null = null;
  @Output() contactRemoved = new EventEmitter<string>();

  constructor(
    private contactApi: ContactApiService,
    private refreshDataService: RefreshDataService,
    private chatSocket: ChatSocketService,
    private chatApi: ChatApiService
  ) {}

  public ngOnInit(): void {
    this.userName = this.refreshDataService.userName;
    this.initializeComponent();
    this.subscribeToOnlineStatus();
  }

  public ngOnDestroy(): void {
    this.unsubscribeFromOnlineStatus();
  }

  private subscribeToOnlineStatus(): void {
    this.unsubscribeFromOnlineStatus();

    this.onlineStatusSubscription = this.chatSocket.onContactOnlineStatus(
      (status: OnlineStatus): void => {
        if (this.contacts.includes(status.userName)) {
          this.onlineStatuses = {
            ...this.onlineStatuses,
            [status.userName]: status.isOnline,
          };
        }
      }
    );
  }

  private unsubscribeFromOnlineStatus(): void {
    if (this.onlineStatusSubscription) {
      this.onlineStatusSubscription();
      this.onlineStatusSubscription = null;
    }
  }

  private async initializeComponent(): Promise<void> {
    await this.ensureUserJoinedChats();
    this.loadContacts();
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

  public onSearchTermChange(term: string): void {
    this.searchTerm = term;
    this.pageIndex = 0;
    this.loadContacts();
  }

  public loadContacts(): void {
    this.contactApi
      .getPaginatedContacts({
        userName: this.userName,
        page: this.pageIndex + 1,
        pageSize: this.pageSize,
        search: this.searchTerm,
      })
      .subscribe((res: { contacts: string[]; total: number }) => {
        this.contacts = res.contacts;
        this.totalContacts = res.total;
        this.setInitialOnlineStatus();
      });
  }

  private setInitialOnlineStatus(): void {
    if (this.contacts.length === 0) return;
    const contactNames: string[] = this.contacts;
    this.chatSocket
      .getOnlineContacts(contactNames)
      .then((onlineContacts: string[]) => {
        const statusMap: { [contact: string]: boolean } = {};
        contactNames.forEach((contact: string) => {
          statusMap[contact] = onlineContacts.includes(contact);
        });
        this.onlineStatuses = statusMap;
      });
  }

  public removeContact(contactName: string): void {
    this.contacts = this.contacts.filter(
      (contact: string) => contact !== contactName
    );
    this.totalContacts = this.contacts.length;
    const { [contactName]: _, ...rest } = this.onlineStatuses;
    this.onlineStatuses = rest;

    this.chatApi
      .deleteDm({ userName1: this.userName, userName2: contactName })
      .subscribe(() => this.contactRemoved.emit(contactName));
  }
}
