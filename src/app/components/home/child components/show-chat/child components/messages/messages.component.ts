import { Component, OnInit } from '@angular/core';
import { messageInfoResponse } from '../../../../../../../../../common/Ro/message.ro';
import { RefreshDataService } from '../../../../../../services/refreshData.service';

@Component({
  selector: 'app-messages',
  standalone: false,
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements OnInit {
  constructor(private refreshDataService: RefreshDataService) {}
  userName: string = '';
  messages: messageInfoResponse[] = [
    {
      sender: 'Jkalush',
      content: 'Hello, this is Jkalush!',
    },
    {
      sender: 'Test',
      content: 'Hi Jkalush, Test here.',
    },
    {
      sender: 'Shoko',
      content: 'Hey everyone, Shoko joined the chat.',
    },
  ];
  ngOnInit(): void {
    this.userName = this.refreshDataService.userName;
  }
}
