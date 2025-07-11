import { Component, OnInit } from '@angular/core';
import { UsersApiService } from '../../../../api/usersApi.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  standalone: false,
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit {
  userName = '';
  chats: string[] = [];
  totalChats = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private usersApiService: UsersApiService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userName = this.userService.userName;
    this.loadChats();
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadChats();
  }

  loadChats() {
    this.usersApiService
      .getPaginatedChats(this.userName, this.pageIndex + 1, this.pageSize)
      .subscribe((res) => {
        this.chats = res.chats;
        this.totalChats = res.total;
      });
  }
}
