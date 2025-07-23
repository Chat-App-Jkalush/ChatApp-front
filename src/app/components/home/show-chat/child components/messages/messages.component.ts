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
import { ChatApiService } from 'app/services/chat/api/chat-api.service';
import { ChatSocketService } from '../../../../../services/chat/chat-socket.service';
import { Subscription } from 'rxjs';

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
  private socketSubscription: Subscription | null = null;

  constructor(
    private chatSocketService: ChatSocketService,
    private chatApi: ChatApiService
  ) {}

  public async ngOnInit(): Promise<void> {
    if (this.chatId) {
      await this.loadMessages();
    }
    this.socketSubscription = this.chatSocketService
      .onEvent$(CommonConstants.GatewayConstants.EVENTS.REPLY)
      .subscribe((message: any) => {
        if (message.chatId === this.chatId) {
          message.createdAt = this.parseDate(message.createdAt);
          this.messages.push(message);
          this.scrollToBottom();
        }
      });
  }

  public async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['chatId']) {
      if (this.chatId) {
        await this.loadMessages();
      }
    }
  }

  public loadMessages(): void {
    if (!this.chatId) return;
    this.chatApi.getChatMessages(this.chatId).subscribe({
      next: (messages) => {
        this.messages = messages.map((msg) => ({
          ...msg,
          createdAt: this.parseDate(msg.createdAt),
        }));
        setTimeout(() => this.scrollToBottom(), 0);
      },
      error: (err) => {
        this.messages = [];
      },
    });
  }

  public ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  public ngOnDestroy(): void {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
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

  public renderMessage(message: Message): void {
    message.createdAt = this.parseDate(message.createdAt);
    this.messages.push(message);
    this.scrollToBottom();
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
