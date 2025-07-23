import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { ChatListItem } from '../../../../models/chat/chat-list-item.model';
import { RefreshDataService } from '../../../../services/refresh/refresh-data.service';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ChatApiService } from 'app/services/chat/api/chat-api.service';
import { PaginatedChatsRo } from 'common/ro/chat/paginated-chats.ro';
import { ChatSocketService } from 'app/services/chat/chat-socket.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  standalone: false,
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit, OnDestroy {
  @Output()
  public selectedChat = new EventEmitter<ChatListItem>();

  public userName: string = '';
  public chats: ChatListItem[] = [];
  public totalChats: number = 0;
  public pageSize: number = 10;
  public pageIndex: number = 0;

  private destroy$ = new Subject<void>();

  public searchTerm: string = '';

  constructor(
    private refreshDataService: RefreshDataService,
    private chatApi: ChatApiService,
    private chatSocketService: ChatSocketService
  ) {}

  public ngOnInit(): void {
    this.refreshDataService.userName$
      .pipe(
        filter((userName: string) => !!userName),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((userName: string) => {
        this.userName = userName;
        this.loadChats();
      });

    this.refreshDataService.chats$
      .pipe(takeUntil(this.destroy$))
      .subscribe((chats: ChatListItem[]) => {
        this.chats = chats;
        this.totalChats = chats.length;
      });

    this.chatSocketService.onEvent('joinNewChat', () => {
      this.loadChats();
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.chatSocketService.removeAllListeners('joinNewChat');
  }

  public onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadChats();
  }

  public loadChats(): void {
    if (!this.userName) return;
    this.chatApi
      .getPaginatedChats({
        userName: this.userName,
        page: this.pageIndex + 1,
        pageSize: this.pageSize,
        search: this.searchTerm,
      })
      .subscribe((res: PaginatedChatsRo) => {
        this.chats = res.chats;
        this.totalChats = res.total;
      });
  }

  public onChatSelect(chatIndex: number): void {
    this.selectedChat.emit(this.chats[chatIndex]);
  }

  public removeChat(chatId: string): void {
    this.refreshDataService.removeChat(chatId);
    this.loadChats();
    this.totalChats = this.chats.length;
    if (this.chats.length === 0) {
      this.selectedChat.emit();
    }
  }

  public onSearchTermChange(term: string): void {
    this.searchTerm = term;
  }
  public onSearchEnter(): void {
    this.pageIndex = 0;
    this.loadChats();
  }
}
