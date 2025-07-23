import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { CommonConstants } from 'common/constatns/common.constants';
import { CreateMessageDto } from 'common/dto/message/create-message.dto';
import {
  BehaviorSubject,
  filter,
  from,
  fromEvent,
  map,
  Observable,
  of,
} from 'rxjs';

export interface OnlineStatus {
  userName: string;
  isOnline: boolean;
}

@Injectable({ providedIn: 'root' })
export class ChatSocketService {
  private socket: Socket;
  private eventListeners: Map<string, Function[]> = new Map<
    string,
    Function[]
  >();

  private onlineStatusSubject = new BehaviorSubject<OnlineStatus[]>([]);
  private contactStatusSubject = new BehaviorSubject<OnlineStatus | null>(null);

  public onlineStatus$ = this.onlineStatusSubject.asObservable();
  public contactStatusChange$ = this.contactStatusSubject.asObservable();

  private onlineUsers = new Set<string>();
  private currentChatId: string | null = null;

  constructor() {
    this.socket = io(CommonConstants.GatewayConstants.DEFAULT_PORT_ORIGIN, {
      transports: ['websocket'],
      withCredentials: true,
    });

    this.socket.on(
      CommonConstants.GatewayConstants.EVENTS.CONNECT,
      (): void => {
        this.refreshOnlineStatus();
      }
    );

    this.socket.on(
      CommonConstants.GatewayConstants.EVENTS.DISCONNECT,
      (reason: string): void => {
        this.onlineUsers.clear();
        this.onlineStatusSubject.next([]);
      }
    );

    this.socket.on(
      CommonConstants.GatewayConstants.EVENTS.CONTACT_ONLINE_STATUS,
      (status: OnlineStatus) => {
        if (status.isOnline) {
          this.onlineUsers.add(status.userName);
        } else {
          this.onlineUsers.delete(status.userName);
        }

        this.contactStatusSubject.next(status);

        const onlineUsersList = Array.from(this.onlineUsers).map(
          (userName) => ({
            userName,
            isOnline: true,
          })
        );
        this.onlineStatusSubject.next(onlineUsersList);
      }
    );

    this.socket.on(
      CommonConstants.GatewayConstants.EVENTS.ONLINE_USERS_LIST,
      (data: { onlineContacts: string[] }) => {
        this.onlineUsers.clear();
        data.onlineContacts.forEach((user) => this.onlineUsers.add(user));

        const onlineUsersList = data.onlineContacts.map((userName) => ({
          userName,
          isOnline: true,
        }));
        this.onlineStatusSubject.next(onlineUsersList);
      }
    );
  }

  public getSocket(): Socket {
    return this.socket;
  }

  public connectToUser(userName: string): void {
    this.socket.emit(CommonConstants.GatewayConstants.EVENTS.JOIN_CHAT, {
      userName,
    });
  }

  public joinSpecificChat(chatId: string): void {
    if (this.currentChatId && this.currentChatId !== chatId) {
      this.socket.emit(CommonConstants.GatewayConstants.EVENTS.LEAVE_CHAT, {
        chatId: this.currentChatId,
      });
    }

    this.currentChatId = chatId;
    this.socket.emit(CommonConstants.GatewayConstants.EVENTS.JOIN_ROOM, {
      chatId,
    });
  }

  public leaveCurrentChat(): void {
    if (this.currentChatId) {
      this.socket.emit(CommonConstants.GatewayConstants.EVENTS.LEAVE_CHAT, {
        chatId: this.currentChatId,
      });
      this.currentChatId = null;
    }
  }

  public sendMessage(message: CreateMessageDto): void {
    this.socket.emit(
      CommonConstants.GatewayConstants.EVENTS.NEW_MESSAGE,
      message
    );
  }

  public onNewMessage(callback: (message: CreateMessageDto) => void): void {
    this.socket.on(
      CommonConstants.GatewayConstants.EVENTS.NEW_MESSAGE,
      (msg: CreateMessageDto) => {
        callback(msg);
      }
    );
  }

  public onEvent(event: string, callback: (...args: any[]) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);

    this.socket.on(event, (...args: any[]): void => {
      callback(...args);
    });
  }

  public removeListener(event: string, callback: Function): void {
    this.socket.off(event, callback as any);

    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event)!;
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  public removeAllListeners(event: string): void {
    this.socket.removeAllListeners(event);
    this.eventListeners.delete(event);
  }

  public disconnect(): void {
    this.socket.disconnect();
    this.eventListeners.clear();
    this.onlineUsers.clear();
    this.onlineStatusSubject.next([]);
  }

  public leaveChat(chatId: string, userName: string): void {
    this.socket.emit(CommonConstants.GatewayConstants.EVENTS.LEAVE_CHAT, {
      chatId,
      userName,
    });
  }

  public isOnline(userName: string): Observable<void> {
    this.socket.emit(CommonConstants.GatewayConstants.EVENTS.IS_ONLINE, {
      userName,
    });
    return fromEvent(
      this.socket,
      CommonConstants.GatewayConstants.EVENTS.IS_ONLINE_RESULT
    ).pipe(
      filter((data: { isOnline: boolean }) => data.isOnline !== undefined),
      map((data: { isOnline: boolean }) => {
        if (data.isOnline) {
          this.onlineUsers.add(userName);
        } else {
          this.onlineUsers.delete(userName);
        }
      })
    );
  }

  public getOnlineContacts(contacts: string[]): Observable<string[]> {
    this.socket.emit(CommonConstants.GatewayConstants.EVENTS.GET_ONLINE_USERS, {
      contacts,
    });
    return fromEvent(
      this.socket,
      CommonConstants.GatewayConstants.EVENTS.ONLINE_USERS_LIST
    ).pipe(
      map((data: { onlineContacts: string[] }) => {
        this.onlineUsers.clear();
        data.onlineContacts.forEach((user) => this.onlineUsers.add(user));
        return data.onlineContacts;
      })
    );
  }

  public onContactOnlineStatus(
    callback: (status: OnlineStatus) => void
  ): () => void {
    const handler = (status: OnlineStatus) => {
      callback(status);
    };
    this.socket.on(
      CommonConstants.GatewayConstants.EVENTS.CONTACT_ONLINE_STATUS,
      handler
    );
    return () => {
      this.socket.off(
        CommonConstants.GatewayConstants.EVENTS.CONTACT_ONLINE_STATUS,
        handler
      );
    };
  }

  public getListenerCount(event: string): number {
    return this.eventListeners.get(event)?.length || 0;
  }

  public getUserOnlineStatus(userName: string): boolean {
    return this.onlineUsers.has(userName);
  }

  public getAllOnlineUsers(): string[] {
    return Array.from(this.onlineUsers);
  }

  private refreshOnlineStatus(): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit(
        CommonConstants.GatewayConstants.EVENTS.GET_ONLINE_USERS,
        {
          contacts: [],
        }
      );
    }
  }

  public isSocketConnected(): boolean {
    return this.socket && this.socket.connected;
  }

  public forceRefreshOnlineStatus(contacts?: string[]): void {
    if (this.isSocketConnected()) {
      this.socket.emit(
        CommonConstants.GatewayConstants.EVENTS.GET_ONLINE_USERS,
        {
          contacts: contacts || [],
        }
      );
    }
  }
}
