import { Component, Input, OnInit } from '@angular/core';
import { ChatListItem } from '../../../../../../models/chat/chat.model';
import { ChatApiService } from '../../../../../../api/chatApi.service';
import { RefreshDataService } from '../../../../../../services/refreshData.service';

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @Input() chat!: ChatListItem;
  otherParticipant: string | null = null;

  constructor(
    private chatApi: ChatApiService,
    private refreshService: RefreshDataService
  ) {}

  ngOnInit(): void {
    if (this.chat.type === 'DM') {
      this.chatApi.getChatParticipants(this.chat.chatId).subscribe(
        (res: { participants: string[] }) => {
          this.otherParticipant =
            res.participants.find(
              (participant) => participant !== this.refreshService.userName
            ) || 'Myself and I';
        },
        () => {
          this.otherParticipant = 'Myself and I';
        }
      );
    } else {
      this.otherParticipant = null;
    }
  }
}
