import { Injectable } from '@angular/core';
import { CommonDto, CommonRo } from '../../../../../common';
import { API_ENDPOINT } from '../../../constants/api.constatns';

@Injectable({
  providedIn: 'root',
})
export class MessageApiService {
  public async getAllByChatId(
    chatId: string
  ): Promise<CommonDto.MessageDto.Message[]> {
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
