import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ContactApiService } from '../../../../../../api/contactApi.service';
import { RefreshDataService } from '../../../../../../services/refreshData.service';
import { RemoveContactDto } from '../../../../../../../../../common/dto/contact.dto';
import { ChatSocketService } from '../../../../../../services/chatSocket.service';

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

  @Input() contactName: string = '';
  @Input() isOnline: boolean = false;
  @Output() contactRemoved = new EventEmitter<string>();

  onRemoveContact() {
    const dto: RemoveContactDto = {
      userName: this.refreshDataService.userName,
      contactName: this.contactName,
    };

    this.contactApi.removeContact(dto).subscribe({
      next: () => {
        this.contactRemoved.emit(this.contactName);
      },
      error: (err) => {
        console.error('Failed to remove contact:', err);
      },
    });
  }
}
