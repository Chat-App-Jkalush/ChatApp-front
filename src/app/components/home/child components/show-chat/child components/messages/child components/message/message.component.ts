import { Component, Input } from '@angular/core';
import { CommonDto, CommonRo } from '../../../../../../../../../../../common';

@Component({
  selector: 'app-message',
  standalone: false,
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  @Input()
  public message: CommonDto.MessageDto.Message = {
    chatId: '',
    sender: '',
    content: '',
    createdAt: new Date(),
  };
}
