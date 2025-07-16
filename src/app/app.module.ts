import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app';
import { LoginComponent } from './components/login-page/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { MatModule } from './mat.module';
import { ChatComponent } from './components/home/child components/chats/child components/chat/chat.component';
import { ChatsComponent } from './components/home/child components/chats/chats.component';
import { ContactsComponent } from './components/home/child components/contacts/contacts.component';
import { ContactComponent } from './components/home/child components/contacts/child components/contact/contact.component';
import { OnInitProvider } from './providers/onInit.provider';
import { AddContactComponent } from './components/home/child components/add-contacts/child components/add-contact/add-contact.component';
import { AddContactsComponent } from './components/home/child components/add-contacts/add-contacts.component';
import { SettingsComponent } from './components/home/child components/settings/settings.component';
import { AddChatComponent } from './components/home/child components/add-chat/add-chat.component';
import { ShowChatComponent } from './components/home/child components/show-chat/show-chat.component';
import { MessagesComponent } from './components/home/child components/show-chat/child components/messages/messages.component';
import { MessageComponent } from './components/home/child components/show-chat/child components/messages/child components/message/message.component';
import { ChatInfoComponent } from './components/home/child components/show-chat/child components/chat-info/chat-info.component';

@NgModule({
  declarations: [
    App,
    LoginComponent,
    NotFoundComponent,
    RegisterComponent,
    HomeComponent,
    ChatComponent,
    ChatsComponent,
    ContactsComponent,
    ContactComponent,
    AddContactComponent,
    AddContactsComponent,
    SettingsComponent,
    AddChatComponent,
    ShowChatComponent,
    MessagesComponent,
    MessageComponent,
    ChatInfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatModule,
    FormsModule,
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    OnInitProvider,
  ],
  bootstrap: [App],
})
export class AppModule {}
