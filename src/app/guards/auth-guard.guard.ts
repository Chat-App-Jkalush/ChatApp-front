import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { RefreshDataService } from '../services/refresh/refresh-data.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private refreshDataService: RefreshDataService,
    private router: Router
  ) {}

  public canActivate(): boolean | UrlTree {
    const userName: string = this.refreshDataService.userName;
    if (!userName) {
      return this.router.createUrlTree(['/login']);
    }
    return true;
  }
}
