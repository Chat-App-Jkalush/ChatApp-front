import { Component, Input } from '@angular/core';
import { messageInfoResponse } from '../../../../../../../../../../../common/Ro/message.ro';

@Component({
  selector: 'app-message',
  standalone: false,
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  @Input()
  message: messageInfoResponse = { sender: '', content: '' };
}
