import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatListItem } from '../../models/chat/chat.model';
import { RefreshDataService } from '../../services/refreshData.service';
import { ChatSocketService } from '../../services/chatSocket.service';
import { ChatApiService } from '../../api/chatApi.service';
import { MessagesComponent } from './child components/show-chat/child components/messages/messages.component';
import { Event } from '@angular/router';
import { ChatsComponent } from './child components/chats/chats.component';

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
  @ViewChild(MessagesComponent) messagesComponent!: MessagesComponent;
  @ViewChild(ChatsComponent) chatsComponent!: ChatsComponent;

  constructor(
    private refreshDataService: RefreshDataService,
    private chatSocketService: ChatSocketService
  ) {}

  ngOnInit(): void {
    this.refreshDataService.userName$.subscribe((name) => {
      this.userName = name;
      if (this.userName) {
        this.chatSocketService.joinChats(this.userName);
      }
    });
    this.chatSocketService.onNewMessage((message) => {
      if (this.selectedChat && this.selectedChat.chatId === message.chatId) {
        this.messagesComponent.renderMessage(message);
      }
    });
  }

  onChatSelected(chat: ChatListItem) {
    this.selectedChat = chat;
    if (chat?.chatId) {
      this.refreshDataService.setLatestChatId(chat.chatId);
    }
  }
  onAddChatFinished() {
    this.tab = 'chats';
  }

  onChatLeft(chatId: string) {
    this.chatsComponent.removeChat(chatId);
  }
}
