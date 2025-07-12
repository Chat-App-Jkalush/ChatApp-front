import { Component } from '@angular/core';

@Component({
  selector: 'app-add-contacts',
  standalone: false,
  templateUrl: './add-contacts.component.html',
  styleUrl: './add-contacts.component.scss',
})
export class AddContactsComponent {
  contactName = '';
  addContact(name: string) {
    console.log('Add contact:', name);
  }
}
