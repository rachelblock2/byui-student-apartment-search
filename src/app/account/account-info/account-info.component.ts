import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Apartment } from 'src/app/apartments/apartment.model';
import { ApartmentService } from 'src/app/apartments/apartment.service';
import { User } from '../account.model';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css'],
})
export class AccountInfoComponent implements OnInit {
  user: User;
  error: string;
  subscription: Subscription;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private apartmentService: ApartmentService
  ) {}

  ngOnInit(): void {
    let token = this.accountService.getTokenCookie();
    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.accountService.getUser();
      this.subscription = this.accountService.userInfoEvent.subscribe(
        (user: User) => {
          this.user = user;
        }
      ),
      (error: any) => {
        this.error = error.message;
      };
    }
  }

  deleteFavorite(favorite) {
    try {
    this.accountService.deleteFavorite(favorite);
    this.router.navigate(['/my-account']);
    } catch (error) {
      this.error = error;
    }
  }

  closeDetails() {
    try {
    // Close the details of the apartment modal
    this.apartmentService.closeAcctDetails();
    } catch (error) {
      this.error = error;
    }
  }

  logoutUser() {
    try {
    this.accountService.logout();
    sessionStorage.removeItem('user');
    this.router.navigate(['/apartments']);
    } catch (error) {
      this.error = error;
    }
  }
}
