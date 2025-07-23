import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { ContactService } from '../../../../services/contact/contact.service';
import { ChatManagementService } from '../../../../services/chat/chat-managment.service';
import { chatType } from '../../../../../../../common/enums/chat.enum';
import { RefreshDataService } from '../../../../services/refresh/refresh-data.service';
import { AddChatParticipantHelper } from '../../../../services/helpers/participent.helper';
import { ChatListItem } from '../../../../models/chat/chat-list-item.model';
import { ChatApiService } from 'app/services/chat/api/chat-api.service';

@Component({
  selector: 'app-add-chat',
  standalone: false,
  templateUrl: './add-chat.component.html',
  styleUrls: ['./add-chat.component.scss'],
})
export class AddChatComponent implements OnInit, OnDestroy {
  @Output() public onFinished = new EventEmitter<void>();

  public addChatForm!: FormGroup;
  public contacts: string[] = [];
  public totalContacts: number = 0;
  public pageSize: number = 10;
  public pageIndex: number = 0;
  public userName: string = '';
  public loading: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private chatManagement: ChatManagementService,
    private refreshDataService: RefreshDataService,
    private chatApiService: ChatApiService,
    private participantHelper: AddChatParticipantHelper
  ) {}

  public ngOnInit(): void {
    this.addChatForm = this.fb.group({
      chatName: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      participants: [[], Validators.required],
    });
    this.setupUserSubscription();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupUserSubscription(): void {
    this.refreshDataService.userName$
      .pipe(takeUntil(this.destroy$))
      .subscribe((userName: string) => {
        this.userName = userName;
        if (userName) this.loadContacts();
      });
  }

  public loadContacts(): void {
    if (!this.userName) return;
    this.loading = true;
    this.errorMessage = '';
    this.contactService
      .getContacts(this.userName, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: { contacts: string[]; total: number }) => {
          this.contacts = res.contacts || [];
          this.totalContacts = res.total || 0;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to load contacts';
          this.loading = false;
        },
      });
  }

  public onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadContacts();
  }

  public removeParticipant(participant: string): void {
    const current = this.addChatForm.get('participants')?.value || [];
    this.addChatForm.patchValue({
      participants: this.participantHelper.removeParticipant(
        current,
        participant
      ),
    });
  }

  public onSubmit(): void {
    if (
      this.addChatForm.invalid ||
      (this.addChatForm.get('participants')?.value?.length ?? 0) === 0
    ) {
      this.addChatForm.markAllAsTouched();
      this.errorMessage =
        'Please fill in all required fields and select at least one participant.';
      return;
    }
    this.clearMessages();
    this.loading = true;
    const chatName: string = this.addChatForm.get('chatName')?.value?.trim();
    const description: string =
      this.addChatForm.get('description')?.value?.trim() || '';
    const creator: string = this.userName;
    const participants: string[] = Array.from(
      new Set([creator, ...this.addChatForm.get('participants')?.value])
    );
    const type: chatType =
      participants.length === 2 ? chatType.DM : chatType.GROUP;

    if (type === chatType.DM) {
      this.chatApiService
        .DmExists({
          userName1: participants[0],
          userName2: participants[1],
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (exists: boolean) => {
            if (exists) {
              this.errorMessage =
                'Direct message already exists between these users.';
              this.loading = false;
              return;
            }
            this.createChat(chatName, participants, type, description);
          },
          error: () => {
            this.errorMessage = 'Failed to check if DM exists';
            this.loading = false;
          },
        });
    } else {
      this.createChat(chatName, participants, type, description);
    }
  }

  private createChat(
    chatName: string,
    participants: string[],
    type: chatType,
    description: string
  ): void {
    this.chatManagement
      .createChatAndUpdateUsers(chatName, participants, type, description)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: {
          success: boolean;
          message: string;
          chat?: ChatListItem;
        }) => {
          this.loading = false;
          if (result.success) {
            this.successMessage =
              result.message || 'Chat created successfully!';
            this.resetForm();
            this.onFinished.emit();
          } else {
            this.errorMessage = result.message || 'Failed to create chat';
          }
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Failed to create chat. Please try again.';
        },
      });
  }

  public onCancel(): void {
    this.resetForm();
    this.onFinished.emit();
  }

  private resetForm(): void {
    this.addChatForm.reset();
    this.clearMessages();
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
