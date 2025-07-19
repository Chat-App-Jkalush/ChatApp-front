import { Injectable } from '@angular/core';
import { ContactApiService } from '../../api/contact/contactApi.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private contactApi: ContactApiService) {}

  public getContacts(
    userName: string,
    pageIndex: number,
    pageSize: number
  ): Observable<{ contacts: string[]; total: number }> {
    return this.contactApi
      .getPaginatedContacts(userName, pageIndex + 1, pageSize)
      .pipe(catchError(() => of({ contacts: [], total: 0 })));
  }
}
