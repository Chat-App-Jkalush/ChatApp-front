import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _userName = signal<string>('');

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userName = localStorage.getItem('userName');
      if (userName) {
        this._userName.set(userName);
      }
    }
  }

  setUserName(userName: string) {
    this._userName.set(userName);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('userName', userName);
    }
  }

  get userName() {
    return this._userName();
  }

  clearUserName() {
    this._userName.set('');
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('userName');
    }
  }
}
