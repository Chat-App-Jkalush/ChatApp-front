import { Injectable } from '@angular/core';
import { ChatApiService } from '../../api/chat/chatApi.service';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, timeout, switchMap, map } from 'rxjs/operators';
import { chatType } from '../../../../../common/enums/chat.enum';

@Injectable({ providedIn: 'root' })
export class ChatManagementService {
  private readonly REQUEST_TIMEOUT: number = 5000;

  constructor(private chatApi: ChatApiService) {}

  public createChatAndUpdateUsers(
    chatName: string,
    participants: string[],
    type: chatType,
    description: string
  ): Observable<{ success: boolean; message: string }> {
    return this.chatApi
      .createChat(chatName, participants, type, description)
      .pipe(
        switchMap((res: { chatId: string; chatName: string }) => {
          if (!res || !res.chatId || !res.chatName) {
            return of({ success: false, message: 'Failed to create chat.' });
          }
          const updateRequests = participants.map((userName: string) =>
            this.chatApi
              .updateUserChats(userName, res.chatId, res.chatName)
              .pipe(
                timeout(this.REQUEST_TIMEOUT),
                catchError(() => of(null))
              )
          );
          return forkJoin(updateRequests).pipe(
            map(() => ({
              success: true,
              message: 'Chat created and added to users!',
            })),
            catchError(() =>
              of({ success: false, message: 'Failed to update user chats.' })
            )
          );
        }),
        catchError(() => {
          return of({
            success: false,
            message: 'Failed to create chat. Please try again.',
          });
        })
      );
  }
}
