import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateChatDto } from 'common/dto/chat/create-chat.dto';
import { DeleteDmDto } from 'common/dto/chat/delete-dm.dto';
import { ChatRo } from 'common/ro/chat/chat.ro';
import { FrontendConstants } from '../../../../constants';
import { PaginatedChatsRo } from 'common/ro/chat/paginated-chats.ro';
import { Message } from 'common/dto/message/message.dto';
import { GetPaginatedChatsDto } from 'common/dto/chat/get-paginated-chats.dto';
import { UpdateUserChats } from 'common/dto/chat/update-user-chats.dto';
import { AddUserToChatDto } from 'common/dto/chat/add-user-to-chat.dto';
import { LeaveChatDto } from 'common/dto/chat/leave-chat.dto';
import { DmExistsDto } from '../../../../../../common/dto/chat/dm-exists.dto';

@Injectable({
  providedIn: 'root',
})
export class ChatApiService {
  constructor(private client: HttpClient) {}

  public getPaginatedChats(
    dto: GetPaginatedChatsDto
  ): Observable<PaginatedChatsRo> {
    let url = `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.CHATS.PAGINATED}?userName=${dto.userName}&page=${dto.page}&pageSize=${dto.pageSize}`;
    if (dto.search) {
      url += `&search=${encodeURIComponent(dto.search)}`;
    }
    return this.client.get<PaginatedChatsRo>(url, { withCredentials: true });
  }

  public updateUserChats(dto: UpdateUserChats): Observable<ChatRo> {
    return this.client.post<ChatRo>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.CHATS.UPDATE_USER_CHATS}`,
      dto,
      { withCredentials: true }
    );
  }

  public addUserToChat(dto: AddUserToChatDto): Observable<Partial<ChatRo>> {
    return this.client.post<Partial<ChatRo>>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.CHATS.ADD_USER_TO_CHAT}`,
      dto,
      { withCredentials: true }
    );
  }

  public createChat(dto: CreateChatDto): Observable<ChatRo> {
    return this.client.post<ChatRo>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.CHATS.CREATE}`,
      dto,
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

  public leaveChat(dto: LeaveChatDto): Observable<boolean> {
    return this.client.post<boolean>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.CHATS.LEAVE_CHAT}`,
      dto,
      { withCredentials: true }
    );
  }

  public DmExists(dto: DmExistsDto): Observable<boolean> {
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

  public getChatMessages(chatId: string): Observable<Message[]> {
    return this.client.get<Message[]>(
      `${FrontendConstants.ApiEndpoint.BASE}/chats/${chatId}/messages`,
      { withCredentials: true }
    );
  }
}
