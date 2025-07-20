import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatApiService } from '../../../../../../api/chat/chatApi.service';
import { ContactService } from '../../../../../../services/contact/contact.service';
import { RefreshDataService } from '../../../../../../services/refresh/refreshData.service';

@Component({
  selector: 'app-chat-info',
  standalone: false,
  templateUrl: './chat-info.component.html',
  styleUrl: './chat-info.component.scss',
})
export class ChatInfoComponent implements OnInit {
  @Input() chat: any;
  @Input() userName: string = '';
  @Output() onLeaveChat = new EventEmitter<string>();
  @Output() participantsChanged = new EventEmitter<string>();
  participents: string[] = [];
  contacts: string[] = [];
  filteredContacts: string[] = [];
  newParticipant: string = '';

  constructor(
    private chatApi: ChatApiService,
    private contactService: ContactService,
    private refreshDataService: RefreshDataService
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
          this.participantsChanged.emit(this.chat.chatId);
        },
      });
    }
  }

  leaveChat(): void {
    this.refreshDataService.removeChat(this.chat.chatId);
    this.onLeaveChat.emit(this.chat.chatId);
  }
}
