import { Injectable } from '@angular/core';
import { ContactApiService } from 'app/services/contact/api/contact-api.service';
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
      .getPaginatedContacts({ userName, page: pageIndex + 1, pageSize })
      .pipe(catchError(() => of({ contacts: [], total: 0 })));
  }
}
