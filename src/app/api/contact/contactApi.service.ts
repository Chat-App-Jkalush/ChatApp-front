import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonDto, CommonRo } from '../../../../../common';
import { FrontendConstants } from '../../../constants';

@Injectable({
  providedIn: 'root',
})
export class ContactApiService {
  constructor(private client: HttpClient) {}

  public addContact(
    userName: string,
    contactName: string
  ): Observable<CommonRo.UserRo.User> {
    return this.client.post<CommonRo.UserRo.User>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.CONTACTS.ADD}`,
      { userName, contactName },
      { withCredentials: true }
    );
  }

  public getPaginatedContacts(
    userName: string,
    page: number,
    pageSize: number
  ): Observable<CommonRo.UserRo.PaginatedContacts> {
    return this.client.get<CommonRo.UserRo.PaginatedContacts>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.CONTACTS.PAGINATED}?userName=${userName}&page=${page}&pageSize=${pageSize}`,
      { withCredentials: true }
    );
  }

  public removeContact(
    dto: CommonDto.ContactDto.RemoveContactDto
  ): Observable<CommonRo.UserRo.User> {
    return this.client.post<CommonRo.UserRo.User>(
      `${FrontendConstants.ApiEndpoint.BASE}${FrontendConstants.ApiEndpoint.CONTACTS.REMOVE}`,
      dto,
      { withCredentials: true }
    );
  }
}
