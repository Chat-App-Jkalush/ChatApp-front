import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatApiService } from '../../../../../../api/chat/chatApi.service';
import { ChatSocketService } from '../../../../../../services/chatSocket.service';
import { RefreshDataService } from '../../../../../../services/refreshData.service';
import { ContactService } from '../../../../../../services/contact.service';

@Component({
  selector: 'app-chat-info',
  standalone: false,
  templateUrl: './chat-info.component.html',
  styleUrl: './chat-info.component.scss',
})
export class ChatInfoComponent implements OnInit {
  @Input() chat: any;
  @Input() userName: string = '';
  @Output() onLeaveChat = new EventEmitter<void>();
  participents: string[] = [];
  contacts: string[] = [];
  filteredContacts: string[] = [];
  newParticipant: string = '';

  constructor(
    private chatApi: ChatApiService,
    private chatSocketService: ChatSocketService,
    private refreshDataService: RefreshDataService,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.chatApi.getChatParticipants(this.chat.chatId).subscribe({
      next: (response: { participants: string[] }) => {
        this.participents = response.participants;
        this.filterContacts();
      },
    });
    this.contactService.getContacts(this.userName, 0, 100).subscribe({
      next: (response: any) => {
        this.contacts = response.contacts || response;
        this.filterContacts();
      },
    });
  }

  filterContacts(): void {
    this.filteredContacts = this.contacts.filter(
      (contact) => !this.participents.includes(contact)
    );
  }

  addParticipant(): void {
    const participant = this.newParticipant.trim();
    if (participant && this.filteredContacts.includes(participant)) {
      this.chatApi.addUserToChat(participant, this.chat.chatId).subscribe({
        next: () => {
          this.participents.push(participant);
          this.filterContacts();
          this.newParticipant = '';
        },
      });
    }
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
