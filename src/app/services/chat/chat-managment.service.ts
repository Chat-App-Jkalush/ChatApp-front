// updated: chat-managment.service.ts (uses ChatSocketService on frontend)
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, from } from 'rxjs';
import { catchError, timeout, switchMap, map, tap } from 'rxjs/operators';
import { chatType } from '../../../../../common/enums/chat.enum';
import { ChatSocketService } from './chat-socket.service';
import { RefreshDataService } from '../refresh/refresh-data.service';
import { ChatApiService } from './api/chat-api.service';

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
    return this.chatApi
      .createChat({ chatName, participants, type, description })
      .pipe(
        switchMap((res: { chatId: string; chatName: string }) => {
          if (!res || !res.chatId || !res.chatName) {
            return of({ success: false, message: 'Failed to create chat.' });
          }

          const updateRequests = participants.map((userName: string) => {
            return this.chatApi
              .updateUserChats({
                userName,
                chatId: res.chatId,
                chatName: res.chatName,
              })
              .pipe(
                timeout(this.REQUEST_TIMEOUT),
                catchError((err) => {
                  return of(null);
                })
              );
          });

          return forkJoin(updateRequests).pipe(
            tap(() => {
              const currentUser = this.refreshDataService.userName;

              participants.forEach((userName) => {
                if (userName !== currentUser) {
                  console.log(` -> ${userName}`);
                  this.chatSocketService.getSocket().emit('joinNewChat', {
                    chatId: res.chatId,
                    targetUser: userName,
                  });
                }
              });

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
              return of({
                success: false,
                message: 'Failed to update user chats.',
              });
            })
          );
        }),
        catchError((err) => {
          return of({
            success: false,
            message: 'Failed to create chat. Please try again.',
          });
        })
      );
  }
}
