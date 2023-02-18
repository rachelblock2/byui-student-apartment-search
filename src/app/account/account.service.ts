import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { User } from '../account/account.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  signup(user: User) {
    if (!user) {
      return;
    }

    // make sure _id of new user is empty
    user._id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    console.log(user);
    // add to database
    this.http
      .post<{ message: string }>(
        'http://localhost:3000/auth/signup',
        user,
        { headers: headers }
      )
      .subscribe((responseData) => {
        console.log(responseData.message);
      });
  }
}
