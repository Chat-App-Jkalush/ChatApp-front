import { Component, OnInit } from '@angular/core';
import { messageInfoResponse } from '../../../../../../../../../common/Ro/message.ro';
import { RefreshDataService } from '../../../../../../services/refreshData.service';
import { MessageApiService } from '../../../../../../api/messageApi.service';

@Component({
  selector: 'app-messages',
  standalone: false,
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  userName: string = '';
  messages: messageInfoResponse[] = [];

  constructor(
    private refreshDataService: RefreshDataService,
    private messageApi: MessageApiService
  ) {}

  async ngOnInit(): Promise<void> {
    this.userName = this.refreshDataService.userName;
    const chatId = this.refreshDataService.latestChatId;
    if (chatId) {
      try {
        this.messages = await this.messageApi.getAllByChatId(chatId);
      } catch (error) {
        this.messages = [];
      }
    }
  }
}
