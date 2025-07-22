import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateChatDto } from 'common/dto/chat/create-chat.dto';
import { DmExitsDto } from 'common/dto/chat/dm-exists.dto';
import { DeleteDmDto } from 'common/dto/chat/delete-dm.dto';
import { ChatRo } from 'common/ro/chat/chat.ro';
import { chatType } from 'common/enums/chat.enum';
import { ChatListItem } from 'app/models/chat/chat.model';
import { FrontendConstants } from '../../../../constants';
import { PaginatedChatsRo } from 'common/ro/chat/paginated-chats.ro';

@Injectable({
  providedIn: 'root',
})
export class ChatApiService {
  constructor(private client: HttpClient) {}

  public getPaginatedChats(
    userName: string,
    page: number,
    pageSize: number,
    search?: string
  ): Observable<PaginatedChatsRo> {
    let url = `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.CHATS.PAGINATED}?userName=${userName}&page=${page}&pageSize=${pageSize}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return this.client.get<PaginatedChatsRo>(url, { withCredentials: true });
  }

  public updateUserChats(
    userName: string,
    chatId: string,
    chatName: string
  ): Observable<ChatRo> {
    return this.client.post<ChatRo>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.CHATS.UPDATE_USER_CHATS}`,
      { userName, chatId, chatName },
      { withCredentials: true }
    );
  }

  public addUserToChat(
    userName: string,
    chatId: string
  ): Observable<Partial<ChatRo>> {
    return this.client.post<Partial<ChatRo>>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.CHATS.ADD_USER_TO_CHAT}`,
      { userName, chatId },
      { withCredentials: true }
    );
  }

  public createChat(
    chatName: string,
    participants: string[] = [],
    type: chatType,
    description: string
  ): Observable<ChatRo> {
    return this.client.post<ChatRo>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.CHATS.CREATE}`,
      { chatName, participants, type, description },
      { withCredentials: true }
    );
  }

  public getChatById(chatId: string): Observable<ChatRo> {
    return this.client.get<ChatRo>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.CHATS.PAGINATED}/${chatId}`,
      { withCredentials: true }
    );
  }

  public getChatParticipants(
    chatId: string
  ): Observable<{ participants: string[] }> {
    return this.client.get<{ participants: string[] }>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.CHATS.GET_PARTICIPANTS}/${chatId}`,
      { withCredentials: true }
    );
  }

  public leaveChat(userName: string, chatId: string): Observable<boolean> {
    return this.client.post<boolean>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.CHATS.LEAVE_CHAT}`,
      { userName, chatId },
      { withCredentials: true }
    );
  }

  public DmExists(dto: DmExitsDto): Observable<boolean> {
    return this.client.post<boolean>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.CHATS.DM_EXISTS}`,
      dto,
      { withCredentials: true }
    );
  }

  deleteDm(dto: DeleteDmDto): Observable<{ message: string }> {
    return this.client.post<{ message: string }>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.CHATS.DELETE_DM}`,
      dto,
      { withCredentials: true }
    );
  }
}
