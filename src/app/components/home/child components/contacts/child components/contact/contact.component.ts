import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ContactApiService } from '../../../../../../api/contact/contactApi.service';
import { RefreshDataService } from '../../../../../../services/refresh/refreshData.service';
import { CommonDto, CommonRo } from '../../../../../../../../../common';
import { ChatSocketService } from '../../../../../../services/chat/chatSocket.service';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  constructor(
    private contactApi: ContactApiService,
    private refreshDataService: RefreshDataService,
    private chatSocket: ChatSocketService
  ) {}

  @Input() public contactName: string = '';
  @Input() public isOnline: boolean = false;
  @Output() public contactRemoved = new EventEmitter<string>();

  public onRemoveContact(): void {
    const dto: CommonDto.ContactDto.RemoveContactDto = {
      userName: this.refreshDataService.userName,
      contactName: this.contactName,
    };

    this.contactApi.removeContact(dto).subscribe({
      next: (): void => {
        this.contactRemoved.emit(this.contactName);
      },
      error: (err: unknown): void => {
        console.error('Failed to remove contact:', err);
      },
    });
  }
}
