import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  Output,
  EventEmitter,
} from '@angular/core';
import { ChatApiService } from '../../../../api/chatApi.service';
import { RefreshDataService } from '../../../../services/refreshData.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatSocketService } from '../../../../services/chatSocket.service';
import { MessagesComponent } from './child components/messages/messages.component';
import { Event } from '@angular/router';

@Component({
  selector: 'app-show-chat',
  standalone: false,
  templateUrl: './show-chat.component.html',
  styleUrls: ['./show-chat.component.scss'],
})
export class ShowChatComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() chat: any;
  @Output() leaveChatEvent = new EventEmitter<string>();
  @ViewChild('messagesContainer', { static: false })
  messagesContainer!: ElementRef;
  @ViewChild(MessagesComponent)
  messagesComponent!: MessagesComponent;

  latestChatId: string | null = null;
  userName: string = '';
  message!: FormGroup;
  private shouldScrollToBottom = false;
  showInfo = false;

  constructor(
    private chatApi: ChatApiService,
    private refreshDataService: RefreshDataService,
    private fb: FormBuilder,
    private chatSocketService: ChatSocketService
  ) {}

  ngOnInit() {
    this.message = this.fb.group({
      content: ['', Validators.required],
      chatId: [this.chat?.chatId || ''],
      sender: [this.userName],
    });

    this.refreshDataService.latestChatId$.subscribe((chatId) => {
      this.latestChatId = chatId;
      if (chatId && !this.chat) {
        this.chatApi.getChatById(chatId).subscribe((chat) => {
          this.chat = chat;
          this.shouldScrollToBottom = true;
          if (this.messagesComponent) {
            this.messagesComponent.chatId = chat.chatId;
            this.messagesComponent.loadMessages();
          }
        });
      }
    });

    this.refreshDataService.userName$.subscribe((userName) => {
      this.userName = userName;
      this.message.patchValue({ sender: userName });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chat'] && this.chat?.chatId) {
      this.refreshDataService.setLatestChatId(this.chat.chatId);
      this.message.patchValue({ chatId: this.chat.chatId });
      this.shouldScrollToBottom = true;
      if (this.messagesComponent) {
        this.messagesComponent.chatId = this.chat.chatId;
        this.messagesComponent.loadMessages();
      }
    }
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      if (this.messagesContainer) {
      }
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      try {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      } catch (err) {}
    }
  }

  sendMessage() {
    if (this.message.invalid) {
      return;
    }

    const messageData = {
      ...this.message.value,
      chatId: this.chat?.chatId || this.latestChatId,
      createdAt: new Date().toISOString(),
    };

    this.chatSocketService.sendMessage(messageData);

    this.message.patchValue({ content: '' });

    this.shouldScrollToBottom = true;
  }

  trackByMessage(index: number, message: any): any {
    return message.id || index;
  }

  onInfoClick(): void {
    this.showInfo = true;
  }
  closeInfo(): void {
    this.showInfo = false;
  }

  leaveChat() {
    this.leaveChatEvent.emit(this.chat?.chatId);
  }
}
