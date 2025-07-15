import { Component, Input } from '@angular/core';
import { messageInfoResponse } from '../../../../../../../../../../../common/Ro/message.ro';
import { Message } from '../../../../../../../../../../../common/dto/message.dto';

@Component({
  selector: 'app-message',
  standalone: false,
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  @Input()
  message: Message = {
    chatId: '',
    sender: '',
    content: '',
    createdAt: new Date(),
  };
}
