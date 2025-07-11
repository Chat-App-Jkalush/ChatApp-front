import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _userName$ = new BehaviorSubject<string>('');

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userName = localStorage.getItem('userName');
      if (userName) {
        this._userName$.next(userName);
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
}
