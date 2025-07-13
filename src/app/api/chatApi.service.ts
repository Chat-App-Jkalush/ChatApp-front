import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT } from '../../constants/api.constatns';
import { chatType } from '../../../../common/enums/chat.enum';

@Injectable({
  providedIn: 'root',
})
export class ChatApiService {
  constructor(private client: HttpClient) {}

  getPaginatedChats(userName: string, page: number, pageSize: number) {
    return this.client.get<{
      chats: { chatId: string; chatName: string; type: string }[];
      total: number;
    }>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.PAGINATED}?userName=${userName}&page=${page}&pageSize=${pageSize}`,
      { withCredentials: true }
    );
  }

  updateUserChats(userName: string, chatId: string, chatName: string) {
    return this.client.post(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.UPDATE_USER_CHATS}`,
      { userName, chatId, chatName },
      { withCredentials: true }
    );
  }

  addUserToChat(userName: string, chatId: string) {
    return this.client.post(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.ADD_USER_TO_CHAT}`,
      { userName, chatId },
      { withCredentials: true }
    );
  }

  createChat(chatName: string, participants: string[] = [], type: chatType) {
    return this.client.post<{ chatId: string; chatName: string }>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.CREATE}`,
      { chatName, participants, type },
      { withCredentials: true }
    );
  }

  getChatById(chatId: string) {
    return this.client.get<{ chatId: string; chatName: string; type: string }>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.PAGINATED}/${chatId}`,
      { withCredentials: true }
    );
  }
}
