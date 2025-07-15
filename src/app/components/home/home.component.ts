import { Component, OnInit } from '@angular/core';
import { ChatListItem } from '../../models/chat/chat.model';
import { RefreshDataService } from '../../services/refreshData.service';
import { ChatSocketService } from '../../services/chatSocket.service';
import { ChatApiService } from '../../api/chatApi.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  tab: string = 'chats';
  selectedChat: ChatListItem | null = null;
  userName: string = '';
  chatIds: string[] = [];

  constructor(
    private refreshDataService: RefreshDataService,
    private chatSocketService: ChatSocketService,
    private chatApi: ChatApiService
  ) {}

  ngOnInit(): void {
    this.refreshDataService.userName$.subscribe((name) => {
      this.userName = name;
      if (this.userName) {
        this.chatSocketService.joinChats(this.userName);
      }
    });
  }

  onChatSelected(chat: ChatListItem) {
    this.selectedChat = chat;
    if (chat?.chatId) {
      console.log('Selected chat ID:', chat.chatId);
      this.refreshDataService.setLatestChatId(chat.chatId);
    }
  }
}
