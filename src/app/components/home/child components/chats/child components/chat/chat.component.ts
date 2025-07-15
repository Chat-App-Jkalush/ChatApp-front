import { Component, Input } from '@angular/core';
import { ChatListItem } from '../../../../../../models/chat/chat.model';

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  @Input() chat!: ChatListItem;
}
