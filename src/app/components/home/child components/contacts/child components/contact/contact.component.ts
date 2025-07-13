import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactApiService } from '../../../../../../api/contactApi.service';
import { RemoveContactDto } from '../../../../../../../../../backend/dist/common/dto/contact.dto';
import { UserService } from '../../../../../../services/user.service';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  constructor(
    private contactApi: ContactApiService,
    private userService: UserService
  ) {}
  @Input()
  contactName: string = '';

  @Output()
  contactRemoved = new EventEmitter<string>();

  onRemoveContact() {
    const dto: RemoveContactDto = {
      userName: this.userService.userName,
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
