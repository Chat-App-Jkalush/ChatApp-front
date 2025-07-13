import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RefreshDataService {
  private _userName$ = new BehaviorSubject<string>('');
  private _latestChatIdSubject = new BehaviorSubject<string>('');

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userName = localStorage.getItem('userName');
      if (userName) {
        this._userName$.next(userName);
      }
      const latestChatId = localStorage.getItem('latestChatId');
      if (latestChatId) {
        this._latestChatIdSubject.next(latestChatId);
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
      localStorage.setItem('latestChatId', chatId);
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
}
