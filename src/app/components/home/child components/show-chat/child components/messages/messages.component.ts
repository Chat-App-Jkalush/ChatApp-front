import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { messageInfoResponse } from '../../../../../../../../../common/Ro/message.ro';
import { MessageApiService } from '../../../../../../api/messageApi.service';

@Component({
  selector: 'app-messages',
  standalone: false,
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnChanges {
  @Input() chatId: string | null = null;
  @Input() userName: string = '';
  messages: messageInfoResponse[] = [];

  constructor(private messageApi: MessageApiService) {}

  ngOnInit(): void {
    if (this.chatId) {
      this.loadMessages();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatId'] && this.chatId) {
      this.loadMessages();
    }
  }

  private async loadMessages(): Promise<void> {
    try {
      this.messages = await this.messageApi.getAllByChatId(this.chatId!);
    } catch (error) {
      this.messages = [];
    }
  }
}
