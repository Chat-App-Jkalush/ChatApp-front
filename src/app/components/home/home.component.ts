import { Component } from '@angular/core';
import { ChatListItem } from '../../models/chat/chat.model';
import { RefreshDataService } from '../../services/refreshData.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  tab: string = 'chats';
  selectedChat: ChatListItem | null = null;

  constructor(private refreshDataService: RefreshDataService) {}

  onChatSelected(chat: ChatListItem) {
    this.selectedChat = chat;
    if (chat?.chatId) {
      this.refreshDataService.setLatestChatId(chat.chatId);
    }
  }
}
