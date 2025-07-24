import { Component, OnInit, ViewChild } from '@angular/core';
import { RefreshDataService } from '../../services/refresh/refresh-data.service';
import { ChatSocketService } from '../../services/chat/chat-socket.service';
import { Router } from '@angular/router';
import { MessagesComponent } from './show-chat/child components/messages/messages.component';
import { ChatsComponent } from './navbar components/chats/chats.component';
import { Subscription } from 'rxjs';
import { CommonConstants } from 'common/constants/common.constants';
import { MessageInfoDTO } from '../../../../../kafka-microservice/dist/common/dto/message/message-info.dto';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public tab: string = 'chats';
  public userName: string = '';
  public chatIds: string[] = [];
  @ViewChild(MessagesComponent) public messagesComponent!: MessagesComponent;
  @ViewChild(ChatsComponent) public chatsComponent!: ChatsComponent;
  private popMessage: Subscription = new Subscription();

  constructor(
    private refreshDataService: RefreshDataService,
    private chatSocketService: ChatSocketService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  public ngOnInit(): void {
    this.refreshDataService.userName$.subscribe((name: string) => {
      this.userName = name;
      if (this.userName) {
        this.chatSocketService.connectToUser(this.userName);
      }
    });
    this.popMessage = this.chatSocketService
      .onEvent$(CommonConstants.GatewayConstants.EVENTS.POP_MESSAGE)
      .subscribe((dto: MessageInfoDTO) => {
        this.snackBar.open(
          `New message from ${dto.chatName}: ${dto.content}`,
          'Close',
          {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }
        );
      });
  }

  public onChatSelected(chat: { chatId: string }): void {
    if (chat?.chatId) {
      this.router.navigate(['/home/chat', chat.chatId]);
    }
  }

  public onAddChatFinished(): void {
    this.tab = 'chats';
    if (this.chatsComponent) {
      this.chatsComponent.loadChats();
    }
  }

  public onChatLeft(chatId: string): void {
    if (this.chatsComponent) {
      this.chatsComponent.removeChat(chatId);
    }
    this.chatsComponent.loadChats();
    this.router.navigate(['/home']);
  }

  public onParticipantsChanged(chatId: string): void {
    if (this.chatsComponent) {
      this.chatsComponent.loadChats();
    }
  }

  public onContactRemoved(contactName: string): void {
    if (this.chatsComponent) {
      this.chatsComponent.loadChats();
    }
  }
}
