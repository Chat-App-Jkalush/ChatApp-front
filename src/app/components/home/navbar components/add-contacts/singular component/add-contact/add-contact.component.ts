import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-contact',
  standalone: false,
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss'],
})
export class AddContactComponent {
  @Input() contactName: string = '';
  @Output() add = new EventEmitter<string>();

  addContact() {
    this.add.emit(this.contactName);
  }
}
