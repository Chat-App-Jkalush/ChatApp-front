import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-show-chat',
  standalone: false,
  templateUrl: './show-chat.component.html',
  styleUrls: ['./show-chat.component.scss'],
})
export class ShowChatComponent {
  @Input() chat: any;
}
