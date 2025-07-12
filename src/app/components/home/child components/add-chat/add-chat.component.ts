import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-chat',
  standalone: false,
  templateUrl: './add-chat.component.html',
  styleUrls: ['./add-chat.component.scss'],
})
export class AddChatComponent implements OnInit {
  addChatForm!: FormGroup;
  contacts: any[] = [
    { userName: 'Alice' },
    { userName: 'Bob' },
    { userName: 'Charlie' },
  ];

  constructor() {}

  ngOnInit(): void {
    this.addChatForm = new FormGroup({
      chatName: new FormControl('', Validators.required),
      participants: new FormControl([], Validators.required),
    });
  }

  onSubmit() {
    if (this.addChatForm.invalid) return;
    const chatData = this.addChatForm.value;
    console.log('Creating chat:', chatData);
  }
}
