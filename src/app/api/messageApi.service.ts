import { Injectable } from '@angular/core';
import { messageInfoResponse } from '../../../../common/Ro/message.ro';
import { API_ENDPOINT } from '../../constants/api.constatns';
import { Message } from '../../../../common/dto/message.dto';

@Injectable({
  providedIn: 'root',
})
export class MessageApiService {
  async getAllByChatId(chatId: string): Promise<Message[]> {
    const url = `${
      API_ENDPOINT.BASE
    }/messages/by-chat?chatId=${encodeURIComponent(chatId)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    return await response.json();
  }
}
