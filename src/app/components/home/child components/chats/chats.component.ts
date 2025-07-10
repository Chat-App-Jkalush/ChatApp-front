import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-chats',
  standalone: false,
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit {
  chats: string[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.chats = this.userService.chatNames();
  }
}
