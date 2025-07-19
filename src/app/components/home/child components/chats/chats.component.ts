import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatApiService } from '../../../../api/chat/chatApi.service';
import { ChatListItem } from '../../../../models/chat/chat.model';
import { RefreshDataService } from '../../../../services/refresh/refreshData.service';
import { distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  standalone: false,
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit {
  @Output()
  public selectedChat = new EventEmitter<ChatListItem>();

  public userName: string = '';
  public chats: ChatListItem[] = [];
  public totalChats: number = 0;
  public pageSize: number = 10;
  public pageIndex: number = 0;

  constructor(
    private refreshDataService: RefreshDataService,
    private chatApi: ChatApiService
  ) {}

  public ngOnInit(): void {
    this.refreshDataService.userName$
      .pipe(
        filter((userName: string) => !!userName),
        distinctUntilChanged()
      )
      .subscribe((userName: string) => {
        this.userName = userName;
        this.loadChats();
      });
  }

  public onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadChats();
  }

  public loadChats(): void {
    if (!this.userName) return;
    this.chatApi
      .getPaginatedChats(this.userName, this.pageIndex + 1, this.pageSize)
      .subscribe((res: { chats: ChatListItem[]; total: number }) => {
        this.chats = res.chats;
        this.totalChats = res.total;
      });
  }

  public onChatSelect(chatIndex: number): void {
    this.selectedChat.emit(this.chats[chatIndex]);
  }

  public removeChat(chatId: string): void {
    this.chats = this.chats.filter(
      (chat: ChatListItem) => chat.chatId !== chatId
    );
    this.totalChats--;
    if (this.chats.length === 0) {
      this.selectedChat.emit();
    }
  }
}
