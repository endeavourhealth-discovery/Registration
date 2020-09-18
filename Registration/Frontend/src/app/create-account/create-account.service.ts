import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Account} from "../model/Account";

@Injectable()
export class CreateAccountService {

  constructor(private http: HttpClient) {  }

  create(account: Account): Observable<Account> {
    return this.http.post<Account>('api/account/', account);
  }
}
