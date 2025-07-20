import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINT } from '../../../constants/api.constatns';
import { chatType } from '../../../../../common/enums/chat.enum';
import { CommonDto, CommonRo } from '../../../../../common';
import { ChatListItem } from '../../models/chat/chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatApiService {
  constructor(private client: HttpClient) {}

  public getPaginatedChats(
    userName: string,
    page: number,
    pageSize: number
  ): Observable<{ chats: ChatListItem[]; total: number }> {
    return this.client.get<{ chats: ChatListItem[]; total: number }>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.PAGINATED}?userName=${userName}&page=${page}&pageSize=${pageSize}`,
      { withCredentials: true }
    );
  }

  public updateUserChats(
    userName: string,
    chatId: string,
    chatName: string
  ): Observable<CommonRo.ChatRo.ChatRo> {
    return this.client.post<CommonRo.ChatRo.ChatRo>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.UPDATE_USER_CHATS}`,
      { userName, chatId, chatName },
      { withCredentials: true }
    );
  }

  public addUserToChat(
    userName: string,
    chatId: string
  ): Observable<Partial<CommonRo.ChatRo.ChatRo>> {
    return this.client.post<Partial<CommonRo.ChatRo.ChatRo>>(
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
  ): Observable<CommonRo.ChatRo.ChatRo> {
    return this.client.post<CommonRo.ChatRo.ChatRo>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.CREATE}`,
      { chatName, participants, type, description },
      { withCredentials: true }
    );
  }

  public getChatById(chatId: string): Observable<CommonRo.ChatRo.ChatRo> {
    return this.client.get<CommonRo.ChatRo.ChatRo>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.PAGINATED}/${chatId}`,
      { withCredentials: true }
    );
  }

  public getChatParticipants(
    chatId: string
  ): Observable<{ participants: string[] }> {
    return this.client.get<{ participants: string[] }>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.GET_PARTICIPANTS}/${chatId}`,
      { withCredentials: true }
    );
  }

  public leaveChat(userName: string, chatId: string): Observable<boolean> {
    return this.client.post<boolean>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.LEAVE_CHAT}`,
      { userName, chatId },
      { withCredentials: true }
    );
  }

  public DmExists(dto: CommonDto.ChatDto.DmExitsDto): Observable<boolean> {
    return this.client.post<boolean>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CHATS.DM_EXISTS}`,
      dto,
      { withCredentials: true }
    );
  }
}
