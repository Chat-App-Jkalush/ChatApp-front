import { Injectable } from '@angular/core';
import { ChatApiService } from '../api/chatApi.service';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, timeout, switchMap, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ChatManagementService {
  private readonly REQUEST_TIMEOUT = 5000;

  constructor(private chatApi: ChatApiService) {}

  createChatAndUpdateUsers(
    chatName: string,
    participants: string[]
  ): Observable<{ success: boolean; message: string }> {
    return this.chatApi.createChat(chatName, participants).pipe(
      switchMap((res) => {
        if (!res || !res.chatId || !res.chatName) {
          return of({ success: false, message: 'Failed to create chat.' });
        }
        const updateRequests = participants.map((userName) =>
          this.chatApi.updateUserChats(userName, res.chatId, res.chatName).pipe(
            timeout(this.REQUEST_TIMEOUT),
            catchError((error) => {
              console.error(
                `Error updating chats for user ${userName}:`,
                error
              );
              return of(null);
            })
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
      catchError((error) => {
        console.error('Error creating chat:', error);
        return of({
          success: false,
          message: 'Failed to create chat. Please try again.',
        });
      })
    );
  }
}
