import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonDto, CommonConstants } from '../../../../../../../../../common';
import { MessageApiService } from '../../../../../../api/message/messageApi.service';
import { ChatSocketService } from '../../../../../../services/chat/chatSocket.service';

@Component({
  selector: 'app-messages',
  standalone: false,
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public chatId: string | null = null;
  @Input() public userName: string = '';
  public messages: CommonDto.MessageDto.Message[] = [];
  private socketListener:
    | ((message: CommonDto.MessageDto.Message) => void)
    | null = null;

  constructor(
    private messageApi: MessageApiService,
    private chatSocketService: ChatSocketService
  ) {}

  public ngOnInit(): void {
    if (this.chatId) {
      this.loadMessages();
    }
    this.socketListener = (message: CommonDto.MessageDto.Message): void => {
      if (this.chatId === message.chatId) {
        message.createdAt = this.parseDate(message.createdAt);
        this.messages.push(message);
      }
    };
    this.chatSocketService.onEvent(
      CommonConstants.GatewayConstants.EVENTS.REPLY,
      this.socketListener
    );
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatId']) {
      if (this.chatId) {
        this.loadMessages();
      }
    }
  }

  public ngOnDestroy(): void {
    if (this.socketListener) {
      this.chatSocketService
        .getSocket()
        .off(
          CommonConstants.GatewayConstants.EVENTS.REPLY,
          this.socketListener
        );
    }
  }

  private parseDate(dateValue: unknown): Date {
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
      this.messages.forEach((msg: CommonDto.MessageDto.Message) => {
        msg.createdAt = this.parseDate(msg.createdAt);
      });
    } catch (error) {
      this.messages = [];
    }
  }

  public renderMessage(message: CommonDto.MessageDto.Message): void {
    message.createdAt = this.parseDate(message.createdAt);
    if (this.chatId === message.chatId) {
      this.messages.push(message);
    }
  }
}
