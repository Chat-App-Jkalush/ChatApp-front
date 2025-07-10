import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app';
import { LoginComponent } from './components/login-page/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { MatModule } from './mat.module';
import { ChatComponent } from './components/chat/chat.component';
import { ChatsComponent } from './components/chats/chats.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ContactComponent } from './components/contact/contact.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [App],
})
export class AppModule {}
