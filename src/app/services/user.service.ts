import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _user: any = null;

  constructor() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this._user = JSON.parse(userJson);
    }
  }

  setUser(user: any) {
    this._user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  get user() {
    return this._user;
  }

  get chats(): Record<string, string> {
    return this._user?.chats ?? {};
  }

  get chatNames(): string[] {
    return Object.values(this.chats);
  }

  clearUser() {
    this._user = null;
    localStorage.removeItem('user');
  }
}
