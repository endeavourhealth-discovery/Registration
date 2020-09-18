import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { Account } from "../model/Account";
import { CreateAccountService} from "./create-account.service";

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})

export class CreateAccountComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CreateAccountComponent>,
              private service: CreateAccountService) { }

  account : Account;

  @ViewChild('userId', { static: false }) userId;
  @ViewChild('forename', { static: false }) forename;
  @ViewChild('surname', { static: false }) surname;
  @ViewChild('password1', { static: false }) password1;
  @ViewChild('password2', { static: false }) password2;

  ngOnInit() {
    this.account = new Account();
  }

  create() {
    if(this.account.userId.trim() == '' ) {
      alert('User Id must not be blank');
      this.userId.nativeElement.focus();
      return;
    } else if(!this.validateEmail(this.account.userId)) {
      alert('Not a valid email address.');
      this.userId.nativeElement.focus();
      return;
    } else if(this.account.forename.trim() == '') {
      alert('Forename must not be blank.');
      this.forename.nativeElement.focus();
      return;
    } else if(this.account.surname.trim() == '') {
      alert('Surname must not be blank.');
      this.surname.nativeElement.focus();
      return;
    } else if(this.password1.nativeElement.value.trim() == '') {
      alert('Password must not be blank.');
      this.password1.nativeElement.focus();
      return;
    } else {
      let passwordInput = this.password1.nativeElement.value.trim()
      if (passwordInput.length < 8) {
        alert('Password must be at least 8 characters long');
        this.password1.nativeElement.focus();
        return;
      } else if (!/\d/.test(passwordInput)) {
        alert('Password must contain at least 1 number');
        this.password1.nativeElement.focus();
        return;
      } else if (!/[A-Z]/.test(passwordInput)) {
        alert('Password must contain at least 1 Uppercase letter');
        this.password1.nativeElement.focus();
        return;
      } else if (this.password1.nativeElement.value.trim() != this.password2.nativeElement.value.trim()){
        alert('Passwords must match');
        this.password2.nativeElement.focus();
        return;
      }
    }
    this.service.create(this.account).subscribe(
      (result) => {
        if (result.errorMessage != null) {
          alert(result.errorMessage);
        } else {
          alert('Account created. Please wait for the confirmation email.');
          this.account = new Account();
          this.password1.nativeElement.value = '';
          this.dialogRef.close();
        }
      },
      error => {
        alert('Generic error occurred. Please contact system administrator.');
      }
    )
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  close() {
    this.dialogRef.close();
  }
}
