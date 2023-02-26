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
  userInfoEvent = new Subject<User>();
  jwtTokenCheck: boolean = false;
  user: User;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router,
    private apartmentService: ApartmentService
  ) {}

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
      .post<{ message: string }>('http://localhost:3000/auth/signup', user, {
        headers: headers,
      })
      .subscribe(
        (responseData) => {
          console.log(responseData.message);
          this.router.navigate(['/login']);
        },
        (error: HttpErrorResponse) => {
          if (error.status === 422) {
            this.router.navigate(['/signup']);
          }
        }
      );
  }

  login(email, password) {
    if (!email || !password) {
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // add to database
    this.http
      .post<{ message: string; accessToken: string; user: User }>(
        'http://localhost:3000/auth/login',
        {
          email: email,
          password: password,
        },
        { headers: headers }
      )
      .subscribe((responseData) => {
        console.log(responseData);
        this.cookieService.set('jwt_token', responseData.accessToken);
        // this.cookieService.set('refresh_token', responseData.refreshToken);
        this.user = responseData.user;
        this.fireChangedTokenCookie(true);
      });
  }

  getUser() {
    let accessToken = this.getTokenCookie();
    let id = this.user._id;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
    this.http
      .get(`http://localhost:3000/auth/user-info/${id}`, { headers: headers })
      .subscribe((responseData: any) => {
        console.log(responseData);
        this.user = responseData.user;
        // this.user = responseData.user;
        this.userInfoEvent.next(this.user);
      });
  }

  getTokenCookie() {
    return this.cookieService.get('jwt_token');
  }

  fireChangedTokenCookie(boolean) {
    this.jwtTokenCheck = boolean;
    this.cookieChangedEvent.next(this.jwtTokenCheck);
  }

  logout() {
    let accessToken = this.getTokenCookie();
    console.log(accessToken);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
    // console.log(headers);
    // console.log(headers["authorization"]);
    this.http
      .post('http://localhost:3000/auth/logout', null, { headers: headers })
      .subscribe((responseData) => {
        console.log(responseData);
        this.cookieService.delete('jwt_token');
        console.log('token is deleted');
        this.fireChangedTokenCookie(false);
      });
  }

  addFavorite(apartment) {
    let accessToken = this.getTokenCookie();
    console.log(accessToken);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    this.http
      .post<{message: string}>('http://localhost:3000/auth/addFavorite', {apartment: apartment, id: this.user._id}, { headers: headers })
      .subscribe((responseData) => {
        console.log(responseData);
        // this.apartmentService.getApartment(responseData.user.favorites[Array.length - 1]);
      });
  }

  deleteFavorite(apartment) {
    let accessToken = this.getTokenCookie();
    console.log(accessToken);
    console.log(apartment);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    this.http
      .post<{message: string}>('http://localhost:3000/auth/deleteFavorite', {apartment: apartment, id: this.user._id}, { headers: headers })
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }
}
