import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { ChatApiService } from '../../../../api/chatApi.service';
import { RefreshDataService } from '../../../../services/refreshData.service';
import { messageInfoResponse } from '../../../../../../../common/Ro/message.ro';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatSocketService } from '../../../../services/chatSocket.service';

@Component({
  selector: 'app-show-chat',
  standalone: false,
  templateUrl: './show-chat.component.html',
  styleUrls: ['./show-chat.component.scss'],
})
export class ShowChatComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() chat: any;
  @ViewChild('messagesContainer', { static: false })
  messagesContainer!: ElementRef;

  latestChatId: string | null = null;
  userName: string = '';
  message!: FormGroup;
  private shouldScrollToBottom = false;

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
    }
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      try {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Error scrolling to bottom:', err);
      }
    }
  }

  sendMessage() {}
  trackByMessage(index: number, message: any): any {
    this.chatSocketService.sendMessage({
      ...this.message.value,
    });
  }
}
