import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ChatApiService } from '../../../../api/chat/chatApi.service';
import { RefreshDataService } from '../../../../services/refresh/refreshData.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatSocketService } from '../../../../services/chat/chatSocket.service';
import { MessagesComponent } from './child components/messages/messages.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-show-chat',
  standalone: false,
  templateUrl: './show-chat.component.html',
  styleUrls: ['./show-chat.component.scss'],
})
export class ShowChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  public chat: any;
  @ViewChild('messagesContainer', { static: false })
  public messagesContainer!: ElementRef;
  @ViewChild(MessagesComponent)
  public messagesComponent!: MessagesComponent;

  public latestChatId: string | null = null;
  public userName: string = '';
  public message!: FormGroup;
  private shouldScrollToBottom: boolean = false;
  public showInfo: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private chatApi: ChatApiService,
    private refreshDataService: RefreshDataService,
    private fb: FormBuilder,
    private chatSocketService: ChatSocketService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.message = this.fb.group({
      content: ['', Validators.required],
      chatId: [''],
      sender: [this.userName],
    });

    const userNameSub: Subscription =
      this.refreshDataService.userName$.subscribe((userName: string) => {
        this.userName = userName;
        this.message.patchValue({ sender: userName });
      });
    this.subscriptions.push(userNameSub);

    const routeSub: Subscription = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        const chatId: string | null = params.get('chatId');
        if (chatId) {
          this.latestChatId = chatId;
          this.loadChat(chatId);
        }
      }
    );
    this.subscriptions.push(routeSub);
  }

  public ngOnDestroy(): void {
    console.log('Unsubscribing from all subscriptions');
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  private loadChat(chatId: string): void {
    this.chatApi.getChatById(chatId).subscribe({
      next: (chat: any) => {
        this.chat = chat;
        this.message.patchValue({ chatId: chat.chatId });
        this.shouldScrollToBottom = true;
      },
      error: (error: any) => {
        console.error('Error loading chat:', error);
        this.router.navigate(['/home']);
      },
    });
  }

  public ngAfterViewChecked(): void {
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
      } catch (err: any) {
        console.error('Error scrolling to bottom:', err);
      }
    }
  }

  public sendMessage(): void {
    if (this.message.invalid || !this.message.get('content')?.value?.trim()) {
      return;
    }

    const messageData: any = {
      ...this.message.value,
      chatId: this.chat?.chatId || this.latestChatId,
      createdAt: new Date().toISOString(),
    };

    this.chatSocketService.sendMessage(messageData);
    this.message.patchValue({ content: '' });
    this.shouldScrollToBottom = true;
  }

  public onInfoClick(): void {
    this.showInfo = true;
  }

  public closeInfo(): void {
    this.showInfo = false;
  }

  public leaveChat(): void {
    if (this.chat?.chatId) {
      this.chatApi.leaveChat(this.userName, this.chat.chatId).subscribe({
        next: (): void => {
          this.chatSocketService.leaveChat(this.chat.chatId, this.userName);
          this.closeInfo();
          this.router.navigate(['/home']);
        },
        error: (error: any): void => {
          console.error('Error leaving chat:', error);
        },
      });
    }
  }
}
