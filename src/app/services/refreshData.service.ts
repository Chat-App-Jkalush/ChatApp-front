import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatListItem } from '../models/chat/chat.model';
import { UserCookieApiService } from '../api/userCookieApi.service';

@Injectable({ providedIn: 'root' })
export class RefreshDataService {
  private _userName$ = new BehaviorSubject<string>('');
  private _latestChatIdSubject = new BehaviorSubject<string>('');
  private _chats$ = new BehaviorSubject<ChatListItem[]>([]);

  constructor(private dataCookieApi: UserCookieApiService) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userName = localStorage.getItem('userName');
      if (userName) {
        this._userName$.next(userName);
      }
      const latestChatId = localStorage.getItem('latestChatId');
      if (latestChatId) {
        this._latestChatIdSubject.next(latestChatId);
      }
      const chats = localStorage.getItem('chats');
      if (chats) {
        try {
          this._chats$.next(JSON.parse(chats));
        } catch {
          this._chats$.next([]);
        }
      }
    }
  }

  setUserName(userName: string) {
    this._userName$.next(userName);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('userName', userName);
    }
  }

  get userName() {
    return this._userName$.value;
  }

  get userName$() {
    return this._userName$.asObservable();
  }

  clearUserName() {
    this._userName$.next('');
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('userName');
    }
  }

  setLatestChatId(chatId: string) {
    this._latestChatIdSubject.next(chatId);
    if (typeof window !== 'undefined' && window.localStorage) {
      this.dataCookieApi.setLatestChatId(this.userName, chatId);
    }
  }

  get latestChatId() {
    return this._latestChatIdSubject.value;
  }

  get latestChatId$() {
    return this._latestChatIdSubject.asObservable();
  }

  clearLatestChatId() {
    this._latestChatIdSubject.next('');
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('latestChatId');
    }
  }

  setChats(chats: ChatListItem[]) {
    this._chats$.next(chats);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('chats', JSON.stringify(chats));
    }
  }

  get chats() {
    return this._chats$.value;
  }

  get chats$() {
    return this._chats$.asObservable();
  }

  clearChats() {
    this._chats$.next([]);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('chats');
    }
  }
}
