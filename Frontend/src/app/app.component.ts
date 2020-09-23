import { Component } from '@angular/core';
import { CreateAccountComponent } from "./create-account/create-account.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Registration';

  constructor(public matDialog: MatDialog) { }

  register() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = "650px";
    this.matDialog.open(CreateAccountComponent, dialogConfig);
  }
}
