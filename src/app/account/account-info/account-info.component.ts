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
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
  user: User;
  // favorite: Apartment[{}];
  // favorites: [{}];
  subscription: Subscription;

  constructor(private router: Router,
    private accountService: AccountService,
    private apartmentService: ApartmentService) { }

  ngOnInit(): void {
    console.log('hey');
    this.accountService.getUser();
    this.subscription = this.accountService.userInfoEvent.subscribe((user: User) => {
      this.user = user;
      // this.favorites = this.user.favorites;
      console.log(this.user);
      console.log(this.user.favorites[0].address);
    });
      // this.subscription = this.apartmentService.apartmentListChangedEvent.subscribe(
      //   (apartments: Apartment[]) => {
      //     this.apartments = apartments;
      //   }
      // )
      // this.apartmentService.getApartments();
  }

  deleteFavorite(favorite) {
    this.accountService.deleteFavorite(favorite);
    this.router.navigate(["/my-account"]);
  }

  logoutUser() {
    this.accountService.logout();
    this.router.navigate(["/apartments"]);
  }

}
