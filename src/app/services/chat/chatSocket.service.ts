import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { CommonDto, CommonConstants } from '../../../../../common';

@Injectable({ providedIn: 'root' })
export class ChatSocketService {
  private socket: Socket;
  private joinedChats: boolean = false;
  private eventListeners: Map<string, Function[]> = new Map<
    string,
    Function[]
  >();

  constructor() {
    this.socket = io(CommonConstants.GatewayConstants.DEFAULT_PORT_ORIGIN, {
      transports: ['websocket'],
      withCredentials: true,
    });

    this.socket.on('connect', (): void => {
      console.log('Socket connected');
      this.joinedChats = false;
    });

    this.socket.on('disconnect', (reason: string): void => {
      console.log('Socket disconnected:', reason);
      this.joinedChats = false;
    });

    this.socket.onAny((event: string, ...args: any[]): void => {
      console.log('Socket event:', event, args);
    });
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
        resolve();
      };

      if (this.socket && this.socket.connected) {
        doJoin();
      } else {
        this.socket.once('connect', doJoin);
      }
    });
  }

  public sendMessage(message: CommonDto.MessageDto.CreateMessageDto): void {
    this.socket.emit(
      CommonConstants.GatewayConstants.EVENTS.NEW_MESSAGE,
      message
    );
  }

  public onNewMessage(
    callback: (message: CommonDto.MessageDto.CreateMessageDto) => void
  ): void {
    this.socket.on(
      CommonConstants.GatewayConstants.EVENTS.NEW_MESSAGE,
      (msg: CommonDto.MessageDto.CreateMessageDto) => {
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
        resolve(false);
      }, 5000);

      this.socket.emit(CommonConstants.GatewayConstants.EVENTS.IS_ONLINE, {
        userName,
      });
      this.socket.once('isOnlineResult', (data: { isOnline: boolean }) => {
        clearTimeout(timeout);
        console.log(`${userName} is ${data.isOnline ? 'online' : 'offline'}`);
        resolve(data.isOnline);
      });
    });
  }

  public getOnlineContacts(contacts: string[]): Promise<string[]> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.log('Timeout getting online contacts');
        resolve([]);
      }, 5000);

      this.socket.emit(
        CommonConstants.GatewayConstants.EVENTS.GET_ONLINE_USERS,
        { contacts }
      );
      this.socket.once(
        'onlineUsersList',
        (data: { onlineContacts: string[] }) => {
          clearTimeout(timeout);
          console.log('Online contacts received:', data.onlineContacts);
          resolve(data.onlineContacts);
        }
      );
    });
  }

  public onContactOnlineStatus(
    callback: (status: CommonDto.ContactDto.ContactOnlineStatus) => void
  ): () => void {
    const handler = (status: CommonDto.ContactDto.ContactOnlineStatus) => {
      callback(status);
    };
    this.socket.on('contactOnlineStatus', handler);
    return () => {
      this.socket.off('contactOnlineStatus', handler);
    };
  }

  public getListenerCount(event: string): number {
    return this.eventListeners.get(event)?.length || 0;
  }
}
