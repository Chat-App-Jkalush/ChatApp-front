import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ChatApiService } from '../../../../api/chatApi.service';
import { RefreshDataService } from '../../../../services/refreshData.service';
import { messageInfoResponse } from '../../../../../../../common/Ro/message.ro';

@Component({
  selector: 'app-show-chat',
  standalone: false,
  templateUrl: './show-chat.component.html',
  styleUrls: ['./show-chat.component.scss'],
})
export class ShowChatComponent implements OnInit, OnChanges {
  @Input() chat: any;
  latestChatId: string | null = null;
  userName: string = '';
  messages: messageInfoResponse[] = [];

  constructor(
    private chatApi: ChatApiService,
    private refreshDataService: RefreshDataService
  ) {}

  ngOnInit() {
    this.refreshDataService.latestChatId$.subscribe((chatId) => {
      this.latestChatId = chatId;
      if (chatId && !this.chat) {
        this.chatApi.getChatById(chatId).subscribe((chat) => {
          this.chat = chat;
        });
      }
    });

    this.refreshDataService.userName$.subscribe((userName) => {
      this.userName = userName;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chat'] && this.chat?.chatId) {
      this.refreshDataService.setLatestChatId(this.chat.chatId);
    }
  }
}
