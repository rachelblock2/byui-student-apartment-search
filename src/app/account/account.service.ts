import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Subject } from 'rxjs';
import { User } from '../account/account.model';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ApartmentService } from '../apartments/apartment.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  cookieChangedEvent = new Subject<boolean>();
  userChangedEvent = new Subject<boolean>();
  userInfoEvent = new Subject<User>();
  user: User;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router,
    private apartmentService: ApartmentService
  ) {}

  // Creates an account for the user
  signup(user: User) {
    if (!user) {
      return;
    }

    // make sure _id of new user is empty
    user._id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string }>('http://localhost:3000/auth/signup', user, {
        headers: headers,
      })
      .subscribe(
        (responseData) => {
          this.router.navigate(['/login']);
        },
        (error: HttpErrorResponse) => {
          if (error.status === 422) {
            this.router.navigate(['/signup']);
            return error.message;
          } else {
            return error.message;
          }
        }
      );
  }

  // Logs the user into their account
  login(email, password) {
    if (!email || !password) {
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // add to database
    this.http
      .post<{
        message: string;
        accessToken: string;
        refreshToken: string;
        user: User;
      }>(
        'http://localhost:3000/auth/login',
        {
          email: email,
          password: password,
        },
        { headers: headers }
      )
      .subscribe((responseData) => {
        this.cookieService.set('jwt_token', responseData.accessToken);
        sessionStorage.setItem('user', JSON.stringify(responseData.user));
        this.cookieService.set('refresh_token', responseData.refreshToken);
        this.user = responseData.user;
        this.fireChangedJWTUser(true);
      },
      (error: any) => {
        return error.message;
      });
  }

  // // Should refresh the user
  // refreshToken(accessToken) {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${accessToken}`,
  //   });
  //   this.http
  //     .get(`http://localhost:3000/auth/refreshToken`, { headers: headers })
  //     .subscribe((responseData: any) => {
  //       console.log(responseData);
  //       console.log('refreshtoken ran');
  //       this.cookieService.set('jwt_token', responseData.accessToken);
  //       // this.cookieService.set('refresh_token', responseData.refreshToken);
  //       this.user = responseData.user;
  //       this.fireChangedTokenCookie(true);
  //     });
  // }

  // Gets the user's account information
  getUser() {
    let accessToken = this.getTokenCookie();
    let user = JSON.parse(sessionStorage.getItem('user'));
    let id;
    // There's no user after the page refreshes state, the user needs to be got again
    if (!user) {
      this.router.navigate(['/login']);
    } else {
      id = user._id;
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
    this.http
      .get(`http://localhost:3000/auth/user-info/${id}`, { headers: headers })
      .subscribe((responseData: any) => {
        this.user = responseData.user;
        this.fireChangedJWTUser(true);
        this.userInfoEvent.next(this.user);
      },
      (error: any) => {
        return error.message;
      });
  }

  // Return current JWT
  getTokenCookie() {
    return this.cookieService.get('jwt_token');
  }

  // Fire event when JWT changes
  fireChangedJWTUser(boolean) {
    this.cookieChangedEvent.next(boolean);
    this.userChangedEvent.next(boolean);
  }

  // Logs the user out of their account
  logout() {
    let accessToken = this.getTokenCookie();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
    this.http
      .post('http://localhost:3000/auth/logout', null, { headers: headers })
      .subscribe((responseData) => {
        this.cookieService.delete('jwt_token');
        sessionStorage.removeItem('user');
        this.fireChangedJWTUser(false);
      },
      (error: any) => {
        return error.message;
      });
  }

  // Adds a favorite apartment to the user's account
  addFavorite(apartment) {
    let accessToken = this.getTokenCookie();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    this.http
      .post<{ message: string }>(
        'http://localhost:3000/auth/addFavorite',
        { apartment: apartment, id: this.user._id },
        { headers: headers }
      )
      .subscribe((responseData) => {
        return;
      },
      (error: any) => {
        return error.message;
      });
  }

  // Removes a favorite apartment to the user's account
  deleteFavorite(apartment) {
    let accessToken = this.getTokenCookie();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    this.http
      .post<{ message: string }>(
        'http://localhost:3000/auth/deleteFavorite',
        { apartment: apartment, id: this.user._id },
        { headers: headers }
      )
      .subscribe((responseData) => {
        return;
      },
      (error: any) => {
        return error.message;
      });
  }

  // Creates an apartment suggestion from the user
  suggestApartment(aptName) {
    let accessToken = this.getTokenCookie();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    this.http
      .post<{ message: string; aptName: string }>(
        'http://localhost:3000/apartments/suggestApartment',
        { aptName: aptName, id: this.user._id },
        { headers: headers }
      )
      .subscribe(
        (responseData) => {
          return;
        },
        (error: any) => {
          return error.message;
        }
      );
  }
}
