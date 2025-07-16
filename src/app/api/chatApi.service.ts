import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT } from '../../constants/api.constatns';
import { chatType } from '../../../../common/enums/chat.enum';
import { DmExitsDto } from '../../../../common/dto/chat.dto';

@Injectable({
  providedIn: 'root',
})
export class ChatApiService {
  constructor(private client: HttpClient) {}

  public getPaginatedChats(
    userName: string,
    page: number,
    pageSize: number
  ): any {
    return this.client.get<{
      chats: {
        chatId: string;
        chatName: string;
        type: string;
        description: string;
      }[];
      total: number;
    }>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.PAGINATED}?userName=${userName}&page=${page}&pageSize=${pageSize}`,
      { withCredentials: true }
    );
  }

  public updateUserChats(
    userName: string,
    chatId: string,
    chatName: string
  ): any {
    return this.client.post(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.UPDATE_USER_CHATS}`,
      { userName, chatId, chatName },
      { withCredentials: true }
    );
  }

  public addUserToChat(userName: string, chatId: string): any {
    return this.client.post(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.ADD_USER_TO_CHAT}`,
      { userName, chatId },
      { withCredentials: true }
    );
  }

  public createChat(
    chatName: string,
    participants: string[] = [],
    type: chatType,
    description: string
  ): any {
    return this.client.post<{
      chatId: string;
      chatName: string;
      description: string;
    }>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.CREATE}`,
      { chatName, participants, type, description },
      { withCredentials: true }
    );
  }

  public getChatById(chatId: string): any {
    return this.client.get<{
      chatId: string;
      chatName: string;
      type: string;
      description: string;
    }>(`${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.PAGINATED}/${chatId}`, {
      withCredentials: true,
    });
  }

  public getChatParticipants(chatId: string): any {
    return this.client.get<{ participants: string[] }>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.GET_PARTICIPANTS}/${chatId}`,
      { withCredentials: true }
    );
  }

  public leaveChat(userName: string, chatId: string): any {
    return this.client.post(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.LEAVE_CHAT}`,
      { userName, chatId },
      { withCredentials: true }
    );
  }

  public DmExists(dto: DmExitsDto): any {
    return this.client.post<boolean>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.DM_EXISTS}`,
      dto,
      { withCredentials: true }
    );
  }
}
