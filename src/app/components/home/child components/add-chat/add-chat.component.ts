import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { ContactService } from '../../../../services/contact/contact.service';
import { ChatManagementService } from '../../../../services/chat/chatManagment.service';
import { chatType } from '../../../../../../../common/enums/chat.enum';
import { RefreshDataService } from '../../../../services/refresh/refreshData.service';
import { ChatApiService } from '../../../../api/chat/chatApi.service';
import { AddChatFormHelper } from '../../../../helpers/AddChatForm.helper';
import { AddChatParticipantHelper } from '../../../../helpers/participent.helper';
import { ChatListItem } from '../../../../models/chat/chat.model';

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
  public selectedParticipants: string[] = [];
  public totalContacts: number = 0;
  public pageSize: number = 10;
  public pageIndex: number = 0;
  public userName: string = '';
  public loading: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private contactService: ContactService,
    private chatManagement: ChatManagementService,
    private refreshDataService: RefreshDataService,
    private chatApiService: ChatApiService,
    private formHelper: AddChatFormHelper,
    private participantHelper: AddChatParticipantHelper
  ) {}

  public ngOnInit(): void {
    this.addChatForm = this.formHelper.createForm();
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
      .subscribe((res: { contacts: string[]; total: number }) => {
        this.contacts = res.contacts || [];
        this.totalContacts = res.total || 0;
        this.loading = false;
      });
  }

  public onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadContacts();
  }

  public onParticipantSelected(participant: string): void {
    this.selectedParticipants = this.participantHelper.addParticipant(
      this.selectedParticipants,
      participant
    );
    this.updateFormParticipants();
  }

  public removeParticipant(participant: string): void {
    this.selectedParticipants = this.participantHelper.removeParticipant(
      this.selectedParticipants,
      participant
    );
    this.updateFormParticipants();
  }

  private updateFormParticipants(): void {
    this.addChatForm.patchValue({
      participants: this.selectedParticipants,
    });
  }

  public onSubmit(): void {
    if (this.addChatForm.invalid) {
      this.formHelper.markFormGroupTouched(this.addChatForm);
      return;
    }
    this.clearMessages();
    this.loading = true;
    const chatName: string = this.addChatForm.get('chatName')?.value;
    const description: string = this.addChatForm.get('description')?.value;
    const creator: string = this.userName;
    const participants: string[] = Array.from(
      new Set([creator, ...this.selectedParticipants])
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
        .subscribe((exists: boolean) => {
          if (exists) {
            this.errorMessage =
              'Direct message already exists between these users.';
            this.loading = false;
            return;
          }
          this.createChat(chatName, participants, type, description);
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
      .subscribe(
        (result: {
          success: boolean;
          message: string;
          chat?: ChatListItem;
        }) => {
          this.loading = false;
          if (result.success && result.chat) {
            this.successMessage = result.message;
            this.formHelper.resetForm(this.addChatForm);
            this.selectedParticipants = [];
            this.clearMessages();
            this.onFinished.emit();
          } else {
            this.onFinished.emit();
          }
        }
      );
  }
  public onCancel(): void {
    this.formHelper.resetForm(this.addChatForm);
    this.selectedParticipants = [];
    this.clearMessages();
    this.onFinished.emit();
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
