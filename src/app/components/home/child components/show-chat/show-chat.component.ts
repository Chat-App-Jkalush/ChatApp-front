import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatApiService } from '../../../../api/chatApi.service';
import { RefreshDataService } from '../../../../services/refreshData.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatSocketService } from '../../../../services/chatSocket.service';
import { MessagesComponent } from './child components/messages/messages.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-show-chat',
  standalone: false,
  templateUrl: './show-chat.component.html',
  styleUrls: ['./show-chat.component.scss'],
})
export class ShowChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  chat: any;
  @ViewChild('messagesContainer', { static: false })
  messagesContainer!: ElementRef;
  @ViewChild(MessagesComponent)
  messagesComponent!: MessagesComponent;

  latestChatId: string | null = null;
  userName: string = '';
  message!: FormGroup;
  private shouldScrollToBottom = false;
  showInfo = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private chatApi: ChatApiService,
    private refreshDataService: RefreshDataService,
    private fb: FormBuilder,
    private chatSocketService: ChatSocketService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.message = this.fb.group({
      content: ['', Validators.required],
      chatId: [''],
      sender: [this.userName],
    });

    const userNameSub = this.refreshDataService.userName$.subscribe(
      (userName) => {
        this.userName = userName;
        this.message.patchValue({ sender: userName });
      }
    );
    this.subscriptions.push(userNameSub);

    const routeSub = this.route.paramMap.subscribe((params) => {
      const chatId = params.get('chatId');
      if (chatId) {
        this.latestChatId = chatId;
        this.loadChat(chatId);
      }
    });
    this.subscriptions.push(routeSub);
  }

  ngOnDestroy() {
    console.log('Unsubscribing from all subscriptions');
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private loadChat(chatId: string) {
    this.chatApi.getChatById(chatId).subscribe({
      next: (chat) => {
        this.chat = chat;
        this.message.patchValue({ chatId: chat.chatId });
        this.shouldScrollToBottom = true;

        setTimeout(() => {
          if (this.messagesComponent) {
            this.messagesComponent.chatId = chat.chatId;
            this.messagesComponent.loadMessages();
          }
        });
      },
      error: (error) => {
        console.error('Error loading chat:', error);
        this.router.navigate(['/home']);
      },
    });
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    if (this.messagesContainer?.nativeElement) {
      try {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Error scrolling to bottom:', err);
      }
    }
  }

  sendMessage() {
    if (this.message.invalid || !this.message.get('content')?.value?.trim()) {
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

  onInfoClick(): void {
    this.showInfo = true;
  }

  closeInfo(): void {
    this.showInfo = false;
  }

  leaveChat() {
    if (this.chat?.chatId) {
      this.chatApi.leaveChat(this.userName, this.chat.chatId).subscribe({
        next: () => {
          this.chatSocketService.leaveChat(this.chat.chatId, this.userName);
          this.closeInfo();
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error leaving chat:', error);
        },
      });
    }
  }
}
