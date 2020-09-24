import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule} from "@angular/router";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatInputModule, MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { CreateAccountComponent } from "./create-account/create-account.component";
import { CreateAccountService } from "./create-account/create-account.service";
import { MessgeBoxDialogComponent } from './messge-box-dialog/messge-box-dialog.component';

@NgModule({

  declarations: [
    AppComponent,
    CreateAccountComponent,
    MessgeBoxDialogComponent
  ],

  imports: [
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    HttpClientModule,
    MatIconModule
  ],

  entryComponents: [
    CreateAccountComponent,
    MessgeBoxDialogComponent
  ],

  providers: [
    CreateAccountService
  ],

  bootstrap: [AppComponent]

})

export class AppModule { }
