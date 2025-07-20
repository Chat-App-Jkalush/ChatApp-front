import { Injectable } from '@angular/core';
import { CommonDto, CommonRo } from '../../../../../common';
import { HttpErrorResponse } from '@angular/common/http';
import { FrontendConstants } from '../../../constants';

@Injectable({
  providedIn: 'root',
})
export class MessageApiService {
  public async getAllByChatId(
    chatId: string
  ): Promise<CommonDto.MessageDto.Message[]> {
    const url = `${
      FrontendConstants.ApiEndpoint.BASE
    }/messages/by-chat?chatId=${encodeURIComponent(chatId)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new HttpErrorResponse({
        error: `Failed to fetch messages for chat ${chatId}`,
        status: response.status,
        statusText: response.statusText,
        url,
      });
    }
    return await response.json();
  }
}
