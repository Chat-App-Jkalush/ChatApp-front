import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINT } from '../../../constants/api.constatns';
import { CommonDto, CommonRo } from '../../../../../common';
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
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CONTACTS.ADD}`,
      { userName, contactName },
      { withCredentials: true }
    );
  }

  public getPaginatedContacts(
    userName: string,
    page: number,
    pageSize: number
  ): Observable<{ contacts: string[]; total: number }> {
    return this.client.get<{ contacts: string[]; total: number }>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CONTACTS.PAGINATED}?userName=${userName}&page=${page}&pageSize=${pageSize}`,
      { withCredentials: true }
    );
  }

  public removeContact(
    dto: CommonDto.ContactDto.RemoveContactDto
  ): Observable<CommonRo.UserRo.User> {
    return this.client.post<CommonRo.UserRo.User>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CONTACTS.REMOVE}`,
      dto,
      { withCredentials: true }
    );
  }
}
