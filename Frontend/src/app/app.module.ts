import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule} from "@angular/router";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatInputModule, MatButtonModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { CreateAccountComponent } from "./create-account/create-account.component";
import { CreateAccountService } from "./create-account/create-account.service";

@NgModule({

  declarations: [
    AppComponent,
    CreateAccountComponent
  ],

  imports: [
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    HttpClientModule
  ],

  entryComponents: [
    CreateAccountComponent
  ],

  providers: [
    CreateAccountService
  ],

  bootstrap: [AppComponent]

})

export class AppModule { }
