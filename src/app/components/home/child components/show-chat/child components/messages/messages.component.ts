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
        message.createdAt = this.parseDate(message.createdAt);
        this.messages.push(message);
      }
    };
    this.chatSocketService.onEvent(EVENTS.REPLY, this.socketListener);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatId']) {
      if (this.chatId) {
        this.loadMessages();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.socketListener) {
      this.chatSocketService.getSocket().off(EVENTS.REPLY, this.socketListener);
    }
  }

  private parseDate(dateValue: any): Date {
    if (!dateValue) {
      return new Date();
    }

    if (dateValue instanceof Date) {
      return dateValue;
    }

    if (typeof dateValue === 'string') {
      const parsedDate = new Date(dateValue);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }

    console.warn('Invalid date format received:', dateValue);
    return new Date();
  }

  public async loadMessages(): Promise<void> {
    try {
      this.messages = await this.messageApi.getAllByChatId(this.chatId!);
      this.messages.forEach((msg) => {
        msg.createdAt = this.parseDate(msg.createdAt);
      });
    } catch (error) {
      this.messages = [];
    }
  }

  public renderMessage(message: Message): void {
    message.createdAt = this.parseDate(message.createdAt);
    if (this.chatId === message.chatId) {
      this.messages.push(message);
    }
  }
}
