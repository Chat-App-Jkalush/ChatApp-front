import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { ContactService } from '../../../../services/contact.service';
import { ChatManagementService } from '../../../../services/chatManagment.service';
import { chatType } from '../../../../../../../common/enums/chat.enum';
import { RefreshDataService } from '../../../../services/refreshData.service';
import { ChatApiService } from '../../../../api/chatApi.service';

@Component({
  selector: 'app-add-chat',
  standalone: false,
  templateUrl: './add-chat.component.html',
  styleUrls: ['./add-chat.component.scss'],
})
export class AddChatComponent implements OnInit, OnDestroy {
  @Output() onFinished = new EventEmitter<void>();

  addChatForm!: FormGroup;
  contacts: string[] = [];
  selectedParticipants: string[] = [];
  totalContacts = 0;
  pageSize = 10;
  pageIndex = 0;
  userName = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private contactService: ContactService,
    private chatManagement: ChatManagementService,
    private refreshDataService: RefreshDataService,
    private chatApiService: ChatApiService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupUserSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.addChatForm = new FormGroup({
      chatName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      description: new FormControl('', [Validators.maxLength(200)]),
      participants: new FormControl([], Validators.required),
    });
  }

  private setupUserSubscription(): void {
    this.refreshDataService.userName$
      .pipe(takeUntil(this.destroy$))
      .subscribe((userName) => {
        this.userName = userName;
        if (userName) this.loadContacts();
      });
  }

  loadContacts(): void {
    if (!this.userName) return;
    this.loading = true;
    this.errorMessage = '';
    this.contactService
      .getContacts(this.userName, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.contacts = res.contacts || [];
        this.totalContacts = res.total || 0;
        this.loading = false;
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadContacts();
  }

  onParticipantSelected(participant: string): void {
    if (participant && !this.selectedParticipants.includes(participant)) {
      this.selectedParticipants.push(participant);
      this.updateFormParticipants();
    }
  }

  removeParticipant(participant: string): void {
    this.selectedParticipants = this.selectedParticipants.filter(
      (p) => p !== participant
    );
    this.updateFormParticipants();
  }

  private updateFormParticipants(): void {
    this.addChatForm.patchValue({
      participants: this.selectedParticipants,
    });
  }

  onSubmit(): void {
    if (this.addChatForm.invalid) {
      this.markFormGroupTouched();
      return;
    }
    this.clearMessages();
    this.loading = true;
    const chatName = this.addChatForm.get('chatName')?.value;
    const description = this.addChatForm.get('description')?.value;
    const creator = this.userName;
    const participants = Array.from(
      new Set([creator, ...this.selectedParticipants])
    );
    const type = participants.length === 2 ? chatType.DM : chatType.GROUP;
    if (type === chatType.DM) {
      if (
        this.chatApiService.DmExists({
          userName1: participants[0],
          userName2: participants[1],
        })
      ) {
        this.errorMessage =
          'Direct message already exists between these users.';
        this.loading = false;
        return;
      }
    }
    this.chatManagement
      .createChatAndUpdateUsers(chatName, participants, type, description)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.loading = false;
        if (result.success) {
          this.successMessage = result.message;
          this.resetForm();
          this.onFinished.emit();
        } else {
          this.errorMessage = result.message;
        }
      });
  }

  onCancel(): void {
    this.resetForm();
    this.onFinished.emit();
  }

  private resetForm(): void {
    this.addChatForm.reset();
    this.selectedParticipants = [];
    this.clearMessages();
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.addChatForm.controls).forEach((key) => {
      const control = this.addChatForm.get(key);
      control?.markAsTouched();
    });
  }
}
