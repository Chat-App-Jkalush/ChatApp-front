import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AddChatParticipantHelper {
  addParticipant(selected: string[], participant: string): string[] {
    return participant && !selected.includes(participant)
      ? [...selected, participant]
      : selected;
  }

  removeParticipant(selected: string[], participant: string): string[] {
    return selected.filter((p) => p !== participant);
  }
}
