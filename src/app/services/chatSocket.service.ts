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
    console.log('[ChatSocketService] Initializing socket...');
    this.socket = io(DEFAULT_PORT_ORIGIN, {
      transports: ['websocket'],
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('[ChatSocketService] Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[ChatSocketService] Socket disconnected:', reason);
    });

    this.socket.onAny((event, ...args) => {
      console.log(`[ChatSocketService] Received event: ${event}`, args);
    });
  }

  getSocket(): Socket {
    console.log('[ChatSocketService] getSocket called');
    return this.socket;
  }

  joinChats(userName: string) {
    console.log('[ChatSocketService] joinChats called:', { userName });
    if (this.socket && this.socket.connected) {
      this.socket.emit(EVENTS.JOIN_CHAT, { userName });
      console.log('[ChatSocketService] JOIN_CHAT emitted:', { userName });
    } else {
      this.socket.once('connect', () => {
        this.socket.emit(EVENTS.JOIN_CHAT, { userName });
        console.log('[ChatSocketService] JOIN_CHAT emitted after connect:', {
          userName,
        });
      });
    }
  }

  sendMessage(message: any) {
    console.log('[ChatSocketService] sendMessage called:', message);
    this.socket.emit(EVENTS.NEW_MESSAGE, message);
  }

  onNewMessage(callback: (message: any) => void) {
    console.log('[ChatSocketService] onNewMessage registered');
    this.socket.on(EVENTS.NEW_MESSAGE, callback);
  }

  onEvent(event: string, callback: (...args: any[]) => void) {
    console.log(`[ChatSocketService] onEvent registered for: ${event}`);
    this.socket.on(event, callback);
  }

  disconnect() {
    console.log('[ChatSocketService] disconnect called');
    this.socket.disconnect();
  }
}
