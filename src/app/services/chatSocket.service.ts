import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import {
  DEFAULT_PORT_ORIGIN,
  EVENTS,
} from '../../../../common/constatns/gateway.contants';

@Injectable({ providedIn: 'root' })
export class ChatSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(DEFAULT_PORT_ORIGIN, {
      transports: ['websocket'],
      withCredentials: true,
    });
  }

  getSocket(): Socket {
    return this.socket;
  }

  joinChats(userName: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(EVENTS.JOIN_CHAT, { userName });
    } else {
      this.socket.once('connect', () => {
        this.socket.emit(EVENTS.JOIN_CHAT, { userName });
      });
    }
  }

  sendMessage(message: any) {
    this.socket.emit(EVENTS.NEW_MESSAGE, message);
  }

  onNewMessage(callback: (message: any) => void) {
    this.socket.on(EVENTS.NEW_MESSAGE, callback);
  }

  onEvent(event: string, callback: (...args: any[]) => void) {
    this.socket.on(event, callback);
  }

  disconnect() {
    this.socket.disconnect();
  }

  leaveChat(chatId: string, userName: string) {
    this.socket.emit(EVENTS.LEAVE_CHAT, { chatId, userName });
  }
}
