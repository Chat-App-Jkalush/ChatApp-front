import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Message } from '../../../../../../../../../common/dto/message.dto';
import { MessageApiService } from '../../../../../../api/messageApi.service';
import { ChatSocketService } from '../../../../../../services/chatSocket.service';
import { EVENTS } from '../../../../../../../../../common/constatns/gateway.contants';

@Component({
  selector: 'app-messages',
  standalone: false,
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() chatId: string | null = null;
  @Input() userName: string = '';
  messages: Message[] = [];
  private socketListener: ((message: Message) => void) | null = null;

  constructor(
    private messageApi: MessageApiService,
    private chatSocketService: ChatSocketService
  ) {}

  ngOnInit(): void {
    if (this.chatId) {
      this.loadMessages();
    }
    this.socketListener = (message: Message) => {
      if (this.chatId === message.chatId) {
        this.messages.push(message);
      }
    };
    this.chatSocketService.onEvent(EVENTS.REPLY, this.socketListener);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatId'] && this.chatId) {
      this.loadMessages();
    }
  }

  ngOnDestroy(): void {
    if (this.socketListener) {
      this.chatSocketService.getSocket().off(EVENTS.REPLY, this.socketListener);
    }
  }

  private async loadMessages(): Promise<void> {
    try {
      this.messages = await this.messageApi.getAllByChatId(this.chatId!);
    } catch (error) {
      this.messages = [];
    }
  }
  public renderMessage(message: Message): void {
    if (!message.createdAt) {
      message.createdAt = new Date();
    }
    if (this.chatId === message.chatId) {
      this.messages.push(message);
    }
  }
}
