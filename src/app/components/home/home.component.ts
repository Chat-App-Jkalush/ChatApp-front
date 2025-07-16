import { Component, OnInit, ViewChild } from '@angular/core';
import { RefreshDataService } from '../../services/refreshData.service';
import { ChatSocketService } from '../../services/chatSocket.service';
import { Router } from '@angular/router';
import { ChatsComponent } from './child components/chats/chats.component';
import { MessagesComponent } from './child components/show-chat/child components/messages/messages.component';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  tab: string = 'chats';
  userName: string = '';
  chatIds: string[] = [];
  @ViewChild(MessagesComponent) messagesComponent!: MessagesComponent;
  @ViewChild(ChatsComponent) chatsComponent!: ChatsComponent;

  constructor(
    private refreshDataService: RefreshDataService,
    private chatSocketService: ChatSocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refreshDataService.userName$.subscribe((name) => {
      this.userName = name;
      if (this.userName) {
        this.chatSocketService.joinChats(this.userName);
      }
    });
  }

  onChatSelected(chat: { chatId: string }) {
    if (chat?.chatId) {
      this.refreshDataService.setLatestChatId(chat.chatId);
      this.router.navigate(['/home/chat', chat.chatId]);
    }
  }

  onAddChatFinished() {
    this.tab = 'chats';
  }

  onChatLeft(chatId: string) {
    if (this.chatsComponent) {
      this.chatsComponent.removeChat(chatId);
    }
    this.router.navigate(['/home']);
  }
}
