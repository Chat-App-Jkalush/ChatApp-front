import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  private readonly apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  popMessage(dto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pop-message`, dto);
  }
}
