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
    private chatApiService: ChatApiService
  ) {}

  public ngOnInit(): void {
    this.initializeForm();
    this.setupUserSubscription();
  }

  public ngOnDestroy(): void {
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
    if (participant && !this.selectedParticipants.includes(participant)) {
      this.selectedParticipants.push(participant);
      this.updateFormParticipants();
    }
  }

  public removeParticipant(participant: string): void {
    this.selectedParticipants = this.selectedParticipants.filter(
      (p: string) => p !== participant
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
      this.markFormGroupTouched();
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
      .subscribe((result: { success: boolean; message: string }) => {
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

  public onCancel(): void {
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
    Object.keys(this.addChatForm.controls).forEach((key: string) => {
      const control = this.addChatForm.get(key);
      control?.markAsTouched();
    });
  }
}
