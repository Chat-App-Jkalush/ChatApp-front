import { Component } from '@angular/core';

@Component({
  selector: 'app-chats',
  standalone: false,
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent {
  constructor() {}
  chats: string[] = ['Chat 1', 'Chat 2', 'Chat 3'];
}
