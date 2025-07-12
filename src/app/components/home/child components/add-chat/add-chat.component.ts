import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactApiService } from '../../../../api/contactApi.service';
import { UserService } from '../../../../services/user.service';
import { PageEvent } from '@angular/material/paginator';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  takeUntil,
  of,
} from 'rxjs';
import { ChatManagementService } from '../../../../services/chatManagment.service';
import { catchError, map } from 'rxjs/operators';
@Component({
  selector: 'app-add-chat',
  standalone: false,
  templateUrl: './add-chat.component.html',
  styleUrls: ['./add-chat.component.scss'],
})
export class AddChatComponent implements OnInit, OnDestroy {
  @Output() chatCreated = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  addChatForm!: FormGroup;
  searchControl = new FormControl('');
  contacts: string[] = [];
  filteredContacts: string[] = [];
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
    private contactApi: ContactApiService,
    private chatManagement: ChatManagementService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupUserSubscription();
    this.setupSearchSubscription();
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
      participants: new FormControl([], Validators.required),
    });
  }

  private setupUserSubscription(): void {
    this.userService.userName$
      .pipe(takeUntil(this.destroy$))
      .subscribe((userName) => {
        this.userName = userName;
        if (userName) {
          this.loadContacts();
        }
      });
  }

  private setupSearchSubscription(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.filterContacts(searchTerm || '');
      });
  }

  loadContacts(): void {
    if (!this.userName) return;
    this.loading = true;
    this.errorMessage = '';
    this.contactApi
      .getPaginatedContacts(this.userName, this.pageIndex + 1, this.pageSize)
      .pipe(
        catchError((error) => {
          this.errorMessage = 'Failed to load contacts. Please try again.';
          return of({ contacts: [], total: 0 });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        this.contacts = res.contacts || [];
        this.totalContacts = res.total || 0;
        this.filterContacts(this.searchControl.value || '');
        this.loading = false;
      });
  }

  private filterContacts(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredContacts = this.contacts.slice();
      return;
    }
    this.filteredContacts = this.contacts.filter((contact) =>
      contact.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadContacts();
  }

  onParticipantSelected(event: MatAutocompleteSelectedEvent): void {
    const participant = event.option.value;
    this.addParticipant(participant);
    this.searchControl.setValue('');
  }

  toggleParticipant(participant: string): void {
    if (this.isParticipantSelected(participant)) {
      this.removeParticipant(participant);
    } else {
      this.addParticipant(participant);
    }
  }

  private addParticipant(participant: string): void {
    if (!this.selectedParticipants.includes(participant)) {
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

  isParticipantSelected(participant: string): boolean {
    return this.selectedParticipants.includes(participant);
  }

  displayFn(contact: string): string {
    return contact || '';
  }

  onSubmit(): void {
    if (this.addChatForm.invalid) {
      this.markFormGroupTouched();
      return;
    }
    this.clearMessages();
    this.loading = true;
    const chatName = this.addChatForm.get('chatName')?.value;
    const creator = this.userName;
    const participants = Array.from(
      new Set([creator, ...this.selectedParticipants])
    );
    this.chatManagement
      .createChatAndUpdateUsers(chatName, participants)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.loading = false;
        if (result.success) {
          this.successMessage = result.message;
          this.resetForm();
        } else {
          this.errorMessage = result.message;
        }
      });
  }

  onCancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  private resetForm(): void {
    this.addChatForm.reset();
    this.selectedParticipants = [];
    this.searchControl.setValue('');
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
