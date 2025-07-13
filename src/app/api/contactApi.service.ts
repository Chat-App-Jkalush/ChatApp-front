import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT } from '../../../constants/api.constatns';
import { RemoveContactDto } from '../../../../backend/dist/common/dto/contact.dto';

@Injectable({
  providedIn: 'root',
})
export class ContactApiService {
  constructor(private client: HttpClient) {}

  addContact(userName: string, contactName: string) {
    return this.client.post(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CONTACTS.ADD}`,
      { userName, contactName },
      { withCredentials: true }
    );
  }

  getPaginatedContacts(userName: string, page: number, pageSize: number) {
    return this.client.get<{ contacts: string[]; total: number }>(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CONTACTS.PAGINATED}?userName=${userName}&page=${page}&pageSize=${pageSize}`,
      { withCredentials: true }
    );
  }

  removeContact(dto: RemoveContactDto) {
    return this.client.post(
      `${API_ENDPOINT.BASE}${API_ENDPOINT.CONTACTS.REMOVE}`,
      dto,
      { withCredentials: true }
    );
  }
}
