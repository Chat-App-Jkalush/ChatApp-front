import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class AddChatFormHelper {
  createForm(): FormGroup {
    return new FormGroup({
      chatName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      description: new FormControl('', [Validators.maxLength(200)]),
      participants: new FormControl([], Validators.required),
    });
  }

  markFormGroupTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach((key: string) => {
      form.get(key)?.markAsTouched();
    });
  }

  resetForm(form: FormGroup): void {
    form.reset();
  }
}
