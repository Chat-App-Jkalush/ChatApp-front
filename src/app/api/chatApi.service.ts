import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT } from '../../../constants/api.constatns';

@Injectable({
  providedIn: 'root',
})
export class ChatApiService {
  constructor(private client: HttpClient) {}

  getPaginatedChats(userName: string, page: number, pageSize: number) {
    return this.client.get<{ chats: string[]; total: number }>(
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

  createChat(chatName: string, participants: string[] = []) {
    return this.client.post(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.CREATE}`,
      { chatName, participants },
      { withCredentials: true }
    );
  }
}
