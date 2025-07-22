import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RemoveContactDto } from 'common/dto/contact/remove-contact.dto';
import { User } from 'common/ro/user/user.ro';
import { PaginatedContacts } from 'common/ro/user/paginated-contacts.ro';
import { FrontendConstants } from '../../../../constants/frontend.constants';

@Injectable({
  providedIn: 'root',
})
export class ContactApiService {
  constructor(private client: HttpClient) {}

  public addContact(userName: string, contactName: string): Observable<User> {
    return this.client.post<User>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.CONTACTS.ADD}`,
      { userName, contactName },
      { withCredentials: true }
    );
  }

  public getPaginatedContacts(
    userName: string,
    page: number,
    pageSize: number,
    search?: string
  ): Observable<PaginatedContacts> {
    let url = `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.CONTACTS.PAGINATED}?userName=${userName}&page=${page}&pageSize=${pageSize}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return this.client.get<PaginatedContacts>(url, { withCredentials: true });
  }

  public removeContact(dto: RemoveContactDto): Observable<User> {
    return this.client.post<User>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.CONTACTS.REMOVE}`,
      dto,
      { withCredentials: true }
    );
  }
}
