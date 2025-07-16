import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatListItem } from '../models/chat/chat.model';
import { UserCookieApiService } from '../api/userCookieApi.service';

@Injectable({ providedIn: 'root' })
export class RefreshDataService {
  private _userName$ = new BehaviorSubject<string>('');
  private _chats$ = new BehaviorSubject<ChatListItem[]>([]);

  constructor(private dataCookieApi: UserCookieApiService) {}

  setUserName(userName: string) {
    this._userName$.next(userName);
  }

  get userName() {
    return this._userName$.value;
  }

  get userName$() {
    return this._userName$.asObservable();
  }

  clearUserName() {
    this._userName$.next('');
  }

  setChats(chats: ChatListItem[]) {
    this._chats$.next(chats);
  }

  get chats() {
    return this._chats$.value;
  }

  get chats$() {
    return this._chats$.asObservable();
  }

  clearChats() {
    this._chats$.next([]);
  }
}
