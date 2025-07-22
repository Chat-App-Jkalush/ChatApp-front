import { Component, Input } from '@angular/core';
import { Message } from '../../../../../../../../../../common/dto';

@Component({
  selector: 'app-message',
  standalone: false,
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  @Input()
  public message: Message = {
    chatId: '',
    sender: '',
    content: '',
    createdAt: new Date(),
  };
}
