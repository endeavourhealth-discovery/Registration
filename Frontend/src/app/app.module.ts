import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule} from "@angular/router";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatInputModule, MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { AppService } from "./app.service";
import { MessgeBoxDialogComponent } from './messge-box-dialog/messge-box-dialog.component';
import { MatCardModule } from "@angular/material/card";

@NgModule({

  declarations: [
    AppComponent,
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
        MatIconModule,
        MatCardModule
    ],

  entryComponents: [
    MessgeBoxDialogComponent
  ],

  providers: [
    AppService
  ],

  bootstrap: [AppComponent]

})

export class AppModule { }
