import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Message } from 'common/dto/message/message.dto';
import { CommonConstants } from 'common/constatns/common.constants';
import { MessageApiService } from '../../../../../api/message/message-api.service';
import { ChatSocketService } from '../../../../../services/chat/chat-socket.service';

@Component({
  selector: 'app-messages',
  standalone: false,
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
  @Input() public chatId: string | null = null;
  @Input() public userName: string = '';
  @ViewChild('messagesScrollContainer') messagesScrollContainer!: ElementRef;
  public messages: Message[] = [];
  private socketListener: ((message: Message) => void) | null = null;

  constructor(
    private messageApi: MessageApiService,
    private chatSocketService: ChatSocketService
  ) {}

  public ngOnInit(): void {
    if (this.chatId) {
      this.loadMessages();
    }
    this.socketListener = (message: Message): void => {
      if (this.chatId === message.chatId) {
        message.createdAt = this.parseDate(message.createdAt);
        this.messages.push(message);
        this.scrollToBottom();
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

  public ngAfterViewInit(): void {
    this.scrollToBottom();
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

    return new Date();
  }

  public async loadMessages(): Promise<void> {
    try {
      this.messages = await this.messageApi.getAllByChatId(this.chatId!);
      this.messages.forEach((msg: Message) => {
        msg.createdAt = this.parseDate(msg.createdAt);
      });
      setTimeout(() => this.scrollToBottom(), 0);
    } catch (error) {
      this.messages = [];
      setTimeout(() => this.scrollToBottom(), 0);
    }
  }

  public renderMessage(message: Message): void {
    message.createdAt = this.parseDate(message.createdAt);
    if (this.chatId === message.chatId) {
      this.messages.push(message);
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesScrollContainer?.nativeElement) {
        this.messagesScrollContainer.nativeElement.scrollTop =
          this.messagesScrollContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }
}
