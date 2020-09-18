export class Account {
  userId: string;
  forename: string;
  surname: string;
  password: string;
  errorMessage: string;

  constructor() {
    this.userId = '';
    this.forename = '';
    this.surname = '';
    this.password = '';
    this.errorMessage = '';
  }
}
