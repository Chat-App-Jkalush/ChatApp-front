import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { ContactApiService } from '../../../../api/contact/contactApi.service';
import { RefreshDataService } from '../../../../services/refresh/refreshData.service';
import { ChatSocketService } from '../../../../services/chat/chatSocket.service';
import { CommonDto, CommonRo } from '../../../../../../../common';
import { ChatApiService } from '../../../../api/chat/chatApi.service';

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
      (data: CommonDto.ContactDto.ContactOnlineStatus): void => {
        if (this.contacts.includes(data.userName)) {
          this.onlineStatuses = {
            ...this.onlineStatuses,
            [data.userName]: data.isOnline,
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

  public loadContacts(): void {
    this.contactApi
      .getPaginatedContacts(this.userName, this.pageIndex + 1, this.pageSize)
      .subscribe((res: any) => {
        this.contacts = res.contacts.map((c: any) =>
          typeof c === 'string' ? c : c.contactName
        );
        this.totalContacts = res.total;
        this.setInitialOnlineStatus();
      });
  }

  private setInitialOnlineStatus(): void {
    if (this.contacts.length === 0) return;
    const contactNames: string[] = this.contacts.map((c: any) =>
      typeof c === 'string' ? c : c.contactName
    );
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
