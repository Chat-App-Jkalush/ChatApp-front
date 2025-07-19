import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT } from '../../../constants/api.constatns';
import { RemoveContactDto } from '../../../../../common/dto/contact.dto';
@Injectable({
  providedIn: 'root',
})
export class ContactApiService {
  constructor(private client: HttpClient) {}

  public addContact(userName: string, contactName: string): any {
    return this.client.post(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CONTACTS.ADD}`,
      { userName, contactName },
      { withCredentials: true }
    );
  }

  public getPaginatedContacts(
    userName: string,
    page: number,
    pageSize: number
  ): any {
    return this.client.get<{ contacts: string[]; total: number }>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CONTACTS.PAGINATED}?userName=${userName}&page=${page}&pageSize=${pageSize}`,
      { withCredentials: true }
    );
  }

  public removeContact(dto: RemoveContactDto): any {
    return this.client.post(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CONTACTS.REMOVE}`,
      dto,
      { withCredentials: true }
    );
  }
}
