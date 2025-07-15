import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatApiService } from '../../../../../../api/chatApi.service';

@Component({
  selector: 'app-chat-info',
  standalone: false,
  templateUrl: './chat-info.component.html',
  styleUrl: './chat-info.component.scss',
})
export class ChatInfoComponent implements OnInit {
  constructor(private chatApi: ChatApiService) {}
  @Input() chat: any;
  @Output() onLeaveCha = new EventEmitter<void>();
  participents: string[] = [];
  ngOnInit(): void {
    if (!this.chat?.chatId) {
      console.error('Chat ID is missing!');
      return;
    }
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
}
