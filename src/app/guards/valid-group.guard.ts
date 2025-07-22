import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ChatApiService } from 'app/api/chat/chat-api.service';
import { RefreshDataService } from 'app/services/refresh/refresh-data.service';
import { Observable, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ValidGroupGuard implements CanActivate {
  constructor(
    private chatApi: ChatApiService,
    private refreshService: RefreshDataService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const chatId = route.paramMap.get('chatId')!;
    return this.chatApi.getChatParticipants(chatId).pipe(
      map((res) => res.participants.includes(this.refreshService.userName)),
      tap((isValid) => {
        if (!isValid) {
          this.router.navigate(['/home']);
        }
      })
    );
  }
}
