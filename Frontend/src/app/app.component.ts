import {Component, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Account} from "./model/Account";
import {MessgeBoxDialogComponent} from "./messge-box-dialog/messge-box-dialog.component";
import {AppService} from "./app.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('userId', { static: false }) userId;
  @ViewChild('forename', { static: false }) forename;
  @ViewChild('surname', { static: false }) surname;
  @ViewChild('password1', { static: false }) password1;
  @ViewChild('password2', { static: false }) password2;

  title = 'Registration';
  account : Account;
  blank : string;
  isDisabled: boolean;

  constructor(private service: AppService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.account = new Account();
    this.isDisabled = false;
  }

  create() {
    if(this.account.userId.trim() == '' ) {
      const dialogRef = this.dialog.open(MessgeBoxDialogComponent, {
        data: { message: "User Id must not be blank.", status: "close" },
      });
      dialogRef.afterClosed().subscribe(result => {
        this.userId.nativeElement.focus();
      });
    } else if(!this.validateEmail(this.account.userId)) {
      const dialogRef = this.dialog.open(MessgeBoxDialogComponent, {
        data: { message: "Not a valid email address.", status: "close" },
      });
      dialogRef.afterClosed().subscribe(result => {
        this.userId.nativeElement.focus();
      });
    } else if(this.account.forename.trim() == '') {
      const dialogRef = this.dialog.open(MessgeBoxDialogComponent, {
        data: { message: "Forename must not be blank.", status: "close" },
      });
      dialogRef.afterClosed().subscribe(result => {
        this.forename.nativeElement.focus();
      });
    } else if(this.account.surname.trim() == '') {
      const dialogRef = this.dialog.open(MessgeBoxDialogComponent, {
        data: { message: "Surname must not be blank.", status: "close" },
      });
      dialogRef.afterClosed().subscribe(result => {
        this.surname.nativeElement.focus();
      });
    } else if(this.password1.nativeElement.value.trim() == '') {
      const dialogRef = this.dialog.open(MessgeBoxDialogComponent, {
        data: { message: "Password must not be blank.", status: "close" },
      });
      dialogRef.afterClosed().subscribe(result => {
        this.password1.nativeElement.focus();
      });
    } else {
      let passwordInput = this.password1.nativeElement.value.trim()
      if (passwordInput.length < 8) {
        const dialogRef = this.dialog.open(MessgeBoxDialogComponent, {
          data: { message: "Password must be at least 8 characters long.", status: "close" },
        });
        dialogRef.afterClosed().subscribe(result => {
          this.password1.nativeElement.focus();
        });
      } else if (!/\d/.test(passwordInput)) {
        const dialogRef = this.dialog.open(MessgeBoxDialogComponent, {
          data: { message: "Password must contain at least 1 number.", status: "close" },
        });
        dialogRef.afterClosed().subscribe(result => {
          this.password1.nativeElement.focus();
        });
      } else if (!/[A-Z]/.test(passwordInput)) {
        const dialogRef = this.dialog.open(MessgeBoxDialogComponent, {
          data: { message: "Password must contain at least 1 uppercase letter.", status: "close" },
        });
        dialogRef.afterClosed().subscribe(result => {
          this.password1.nativeElement.focus();
        });
      } else if (this.password1.nativeElement.value.trim() != this.password2.nativeElement.value.trim()){
        const dialogRef = this.dialog.open(MessgeBoxDialogComponent, {
          data: { message: "Passwords must match.", status: "close" },
        });
        dialogRef.afterClosed().subscribe(result => {
          this.password2.nativeElement.focus();
        });
      } else {
        this.isDisabled = true;
        this.service.create(this.account).subscribe(
          (result) => {
            if (result.errorMessage != null) {
              this.dialog.open(MessgeBoxDialogComponent, {
                data: { message: result.errorMessage, status: "close" },
              });
              this.isDisabled = false;
            } else {
              const dialogRef = this.dialog.open(MessgeBoxDialogComponent, {
                data: { message: "Account created. Please wait for the confirmation email.", status: "done_outline" },
              });
              this.isDisabled = false;
            }
          },
          error => {
            this.dialog.open(MessgeBoxDialogComponent, {
              data: { message: "Generic error occurred. Please contact system administrator.", status: "close" },
            });
            this.isDisabled = false;
          }
        );
      }
    }
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
