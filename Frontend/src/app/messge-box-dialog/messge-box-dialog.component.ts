import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

export interface DialogData {
  message: string;
  status: string;
}

@Component({
  selector: 'app-messge-box-dialog',
  templateUrl: './messge-box-dialog.component.html',
  styleUrls: ['./messge-box-dialog.component.scss']
})
export class MessgeBoxDialogComponent {

  message: string;
  status: string;

  constructor(public dialogRef: MatDialogRef<MessgeBoxDialogComponent>,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,) {
    this.message = data.message;
    this.status = data.status;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MessgeBoxDialogComponent, {});
    dialogRef.afterClosed();
  }
}
