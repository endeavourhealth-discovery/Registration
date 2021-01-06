import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Account} from "./model/Account";
import {Observable} from "rxjs/Observable";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) {  }

  create(account: Account): Observable<Account> {
    return this.http.post<Account>('api/account/', account);
  }
}
