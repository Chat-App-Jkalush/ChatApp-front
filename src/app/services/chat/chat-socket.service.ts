import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { CommonConstants } from 'common/constatns/common.constants';
import { CreateMessageDto } from 'common/dto/message/create-message.dto';
import { BehaviorSubject, Observable } from 'rxjs';

export interface OnlineStatus {
  userName: string;
  isOnline: boolean;
}

@Injectable({ providedIn: 'root' })
export class ChatSocketService {
  private socket: Socket;
  private joinedChats: boolean = false;
  private eventListeners: Map<string, Function[]> = new Map<
    string,
    Function[]
  >();

  private onlineStatusSubject = new BehaviorSubject<OnlineStatus[]>([]);
  private contactStatusSubject = new BehaviorSubject<OnlineStatus | null>(null);

  public onlineStatus$ = this.onlineStatusSubject.asObservable();
  public contactStatusChange$ = this.contactStatusSubject.asObservable();

  private onlineUsers = new Set<string>();

  constructor() {
    this.socket = io(CommonConstants.GatewayConstants.DEFAULT_PORT_ORIGIN, {
      transports: ['websocket'],
      withCredentials: true,
    });

    this.socket.on(
      CommonConstants.GatewayConstants.EVENTS.CONNECT,
      (): void => {
        console.log('Socket connected');
        this.joinedChats = false;
        this.refreshOnlineStatus();
      }
    );

    this.socket.on(
      CommonConstants.GatewayConstants.EVENTS.DISCONNECT,
      (reason: string): void => {
        console.log('Socket disconnected:', reason);
        this.joinedChats = false;
        this.onlineUsers.clear();
        this.onlineStatusSubject.next([]);
      }
    );

    this.socket.onAny((event: string, ...args: any[]): void => {
      console.log('Socket event:', event, args);
    });

    this.socket.on(
      CommonConstants.GatewayConstants.EVENTS.JOIN_NEW_CHAT,
      (data: { chatId: string }) => {
        this.socket.emit(CommonConstants.GatewayConstants.EVENTS.JOIN_ROOM, {
          chatId: data.chatId,
        });
        console.log(`Joined new chat room: ${data.chatId}`);
      }
    );

    this.socket.on(
      CommonConstants.GatewayConstants.EVENTS.CONTACT_ONLINE_STATUS,
      (status: OnlineStatus) => {
        console.log('Contact status changed:', status);

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
        console.log('Online contacts received:', data.onlineContacts);

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

  public joinChats(userName: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.joinedChats) {
        resolve();
        return;
      }

      const doJoin = (): void => {
        this.socket.emit(CommonConstants.GatewayConstants.EVENTS.JOIN_CHAT, {
          userName,
        });
        this.joinedChats = true;
        console.log(`User ${userName} joined chats`);

        setTimeout(() => {
          this.refreshOnlineStatus();
        }, 500);

        resolve();
      };

      if (this.socket && this.socket.connected) {
        doJoin();
      } else {
        this.socket.once(
          CommonConstants.GatewayConstants.EVENTS.CONNECT,
          doJoin
        );
      }
    });
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

    console.log(
      `Registered listener for event: ${event}. Total listeners: ${
        this.eventListeners.get(event)!.length
      }`
    );
  }

  public removeListener(event: string, callback: Function): void {
    this.socket.off(event, callback as any);

    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event)!;
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
      console.log(
        `Removed listener for event: ${event}. Remaining listeners: ${listeners.length}`
      );
    }
  }

  public removeAllListeners(event: string): void {
    this.socket.removeAllListeners(event);
    this.eventListeners.delete(event);
    console.log(`Removed all listeners for event: ${event}`);
  }

  public disconnect(): void {
    this.socket.disconnect();
    this.joinedChats = false;
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

  public isOnline(userName: string): Promise<boolean> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.log(`Timeout checking if ${userName} is online`);
        const isOnlineLocal = this.onlineUsers.has(userName);
        resolve(isOnlineLocal);
      }, 5000);

      this.socket.emit(CommonConstants.GatewayConstants.EVENTS.IS_ONLINE, {
        userName,
      });
      this.socket.once(
        CommonConstants.GatewayConstants.EVENTS.IS_ONLINE_RESULT,
        (data: { userName: string; isOnline: boolean }) => {
          clearTimeout(timeout);
          console.log(`${userName} is ${data.isOnline ? 'online' : 'offline'}`);

          if (data.isOnline) {
            this.onlineUsers.add(userName);
          } else {
            this.onlineUsers.delete(userName);
          }

          resolve(data.isOnline);
        }
      );
    });
  }

  public getOnlineContacts(contacts: string[]): Promise<string[]> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.log('Timeout getting online contacts');
        const onlineFromCache = contacts.filter((contact) =>
          this.onlineUsers.has(contact)
        );
        resolve(onlineFromCache);
      }, 5000);

      this.socket.emit(
        CommonConstants.GatewayConstants.EVENTS.GET_ONLINE_USERS,
        { contacts }
      );
      this.socket.once(
        CommonConstants.GatewayConstants.EVENTS.ONLINE_USERS_LIST,
        (data: { onlineContacts: string[] }) => {
          clearTimeout(timeout);
          console.log('Online contacts received:', data.onlineContacts);

          this.onlineUsers.clear();
          data.onlineContacts.forEach((user) => this.onlineUsers.add(user));

          resolve(data.onlineContacts);
        }
      );
    });
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
