import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatApiService } from '../../../../../../api/chatApi.service';
import { ChatSocketService } from '../../../../../../services/chatSocket.service';

@Component({
  selector: 'app-chat-info',
  standalone: false,
  templateUrl: './chat-info.component.html',
  styleUrl: './chat-info.component.scss',
})
export class ChatInfoComponent implements OnInit {
  constructor(
    private chatApi: ChatApiService,
    private chatSocketService: ChatSocketService
  ) {}
  @Input() chat: any;
  @Input() userName: string = '';
  @Output() onLeaveChat = new EventEmitter<void>();
  participents: string[] = [];
  ngOnInit(): void {
    this.chatApi.getChatParticipants(this.chat.chatId).subscribe({
      next: (response) => {
        console.log('Chat participants:', response.participants);
        this.participents = response.participants;
      },
      error: (error) => {
        console.error('Error fetching chat participants:', error);
      },
    });
  }
  leaveChat(): void {
    this.chatApi.leaveChat(this.userName, this.chat.chatId).subscribe({
      next: () => {
        this.chatSocketService.leaveChat(this.chat.chatId, this.userName);
        this.onLeaveChat.emit();
      },
    });
  }
}
