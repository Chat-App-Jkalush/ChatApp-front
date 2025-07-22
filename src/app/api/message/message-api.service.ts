import { Injectable } from '@angular/core';
import { Message } from '../../../../../common/dto';
import { HttpErrorResponse } from '@angular/common/http';
import { FrontendConstants } from '../../../constants';

@Injectable({
  providedIn: 'root',
})
export class MessageApiService {
  public async getAllByChatId(chatId: string): Promise<Message[]> {
    const url = `${
      FrontendConstants.ApiEndpoint.BASE
    }/messages/by-chat?chatId=${encodeURIComponent(chatId)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new HttpErrorResponse({
        error: `Failed to fetch messages for chat ${chatId}`,
        status: response.status,
      });
    }
    return (await response.json()) as Message[];
  }
}
