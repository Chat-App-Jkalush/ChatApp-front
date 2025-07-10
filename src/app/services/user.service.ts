import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _user = signal<any>(null);

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        this._user.set(JSON.parse(userJson));
      }
    }
  }

  setUser(user: any) {
    this._user.set(user);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  user = this._user.asReadonly();
  chats = computed(() => this._user()?.chats ?? {});
  chatNames = computed(() => Object.values(this.chats()) as string[]);

  clearUser() {
    this._user.set(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('user');
    }
  }
}
