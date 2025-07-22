// updated: chat-managment.service.ts (uses ChatSocketService on frontend)
import { Injectable } from '@angular/core';
import { ChatApiService } from '../../api/chat/chat-api.service';
import { Observable, forkJoin, of, from } from 'rxjs';
import { catchError, timeout, switchMap, map, tap } from 'rxjs/operators';
import { chatType } from '../../../../../common/enums/chat.enum';
import { ChatSocketService } from './chat-socket.service';
import { RefreshDataService } from '../refresh/refresh-data.service';

@Injectable({ providedIn: 'root' })
export class ChatManagementService {
  private readonly REQUEST_TIMEOUT: number = 5000;

  constructor(
    private chatApi: ChatApiService,
    private chatSocketService: ChatSocketService,
    private refreshDataService: RefreshDataService
  ) {}

  public createChatAndUpdateUsers(
    chatName: string,
    participants: string[],
    type: chatType,
    description: string
  ): Observable<{ success: boolean; message: string }> {
    console.log('[ChatManagementService] Creating chat with:', {
      chatName,
      participants,
      type,
      description,
    });

    return this.chatApi
      .createChat(chatName, participants, type, description)
      .pipe(
        switchMap((res: { chatId: string; chatName: string }) => {
          console.log('[ChatManagementService] Chat created response:', res);

          if (!res || !res.chatId || !res.chatName) {
            console.warn('[ChatManagementService] Invalid chat response');
            return of({ success: false, message: 'Failed to create chat.' });
          }

          const updateRequests = participants.map((userName: string) => {
            console.log(`[ChatManagementService] Updating user: ${userName}`);
            return this.chatApi
              .updateUserChats(userName, res.chatId, res.chatName)
              .pipe(
                timeout(this.REQUEST_TIMEOUT),
                catchError((err) => {
                  console.error(
                    `[ChatManagementService] Failed to update ${userName}:`,
                    err
                  );
                  return of(null);
                })
              );
          });

          return forkJoin(updateRequests).pipe(
            tap(() => {
              const currentUser = this.refreshDataService.userName;
              console.log(
                '[ChatManagementService] Current user is:',
                currentUser
              );
              console.log('[ChatManagementService] Emitting joinNewChat to:');

              participants.forEach((userName) => {
                if (userName !== currentUser) {
                  console.log(` -> ${userName}`);
                  this.chatSocketService.getSocket().emit('joinNewChat', {
                    chatId: res.chatId,
                    targetUser: userName,
                  });
                }
              });

              console.log(
                `[ChatManagementService] Emitting joinRoom for current user to chat ${res.chatId}`
              );
              this.chatSocketService.getSocket().emit('joinRoom', {
                chatId: res.chatId,
              });
            }),
            switchMap(() =>
              of({
                success: true,
                message: 'Chat created and added to users!',
              })
            ),
            catchError((err) => {
              console.error(
                '[ChatManagementService] Failed to update user chats:',
                err
              );
              return of({
                success: false,
                message: 'Failed to update user chats.',
              });
            })
          );
        }),
        catchError((err) => {
          console.error('[ChatManagementService] Failed to create chat:', err);
          return of({
            success: false,
            message: 'Failed to create chat. Please try again.',
          });
        })
      );
  }
}
