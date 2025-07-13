import { Component } from '@angular/core';
import { ChatListItem } from '../../models/chat/chat.model';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  tab: string = 'chats';
  selectedChat: ChatListItem | null = null;

  onChatSelected(chat: ChatListItem) {
    this.selectedChat = chat;
  }
}
