import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UsersApiService } from '../../../../api/usersApi.service';
import { UserService } from '../../../../services/user.service';
import { ChatApiService } from '../../../../api/chatApi.service';
import { ChatListItem } from '../../../../models/chat/chat.model';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  standalone: false,
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit {
  @Output()
  selectedChat = new EventEmitter<ChatListItem>();

  userName = '';
  chats: ChatListItem[] = [];
  totalChats = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private userService: UserService,
    private chatApi: ChatApiService
  ) {}

  ngOnInit(): void {
    this.userService.userName$.subscribe((userName) => {
      this.userName = userName;
      this.loadChats();
    });
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadChats();
  }

  loadChats() {
    if (!this.userName) return;
    this.chatApi
      .getPaginatedChats(this.userName, this.pageIndex + 1, this.pageSize)
      .subscribe((res) => {
        this.chats = res.chats;
        this.totalChats = res.total;
      });
  }

  onChatSelect(chatIndex: number) {
    this.selectedChat.emit(this.chats[chatIndex]);
  }
}
