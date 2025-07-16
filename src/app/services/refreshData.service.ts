import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatListItem } from '../models/chat/chat.model';
import { UserCookieApiService } from '../api/userCookieApi.service';

@Injectable({ providedIn: 'root' })
export class RefreshDataService {
  private _userName$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _chats$: BehaviorSubject<ChatListItem[]> = new BehaviorSubject<
    ChatListItem[]
  >([]);

  constructor(private dataCookieApi: UserCookieApiService) {}

  public setUserName(userName: string): void {
    console.log('setUserName called with', userName);
    this._userName$.next(userName);
  }

  public get userName(): string {
    return this._userName$.value;
  }

  public get userName$(): Observable<string> {
    return this._userName$.asObservable();
  }

  public clearUserName(): void {
    this._userName$.next('');
  }

  public setChats(chats: ChatListItem[]): void {
    this._chats$.next(chats);
  }

  public get chats(): ChatListItem[] {
    return this._chats$.value;
  }

  public get chats$(): Observable<ChatListItem[]> {
    return this._chats$.asObservable();
  }

  public clearChats(): void {
    this._chats$.next([]);
  }
}
