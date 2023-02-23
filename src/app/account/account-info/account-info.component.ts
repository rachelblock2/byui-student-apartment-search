import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  subscription: Subscription;

  constructor(private router: Router,
    private accountService: AccountService,
    private apartmentService: ApartmentService) { }

  ngOnInit(): void {
    console.log('hey');
    this.accountService.getUser();
    this.subscription = this.accountService.userInfoEvent.subscribe((user: User) => {
      this.user = user;
      console.log(this.user);
    });
      // this.subscription = this.apartmentService.apartmentListChangedEvent.subscribe(
      //   (apartments: Apartment[]) => {
      //     this.apartments = apartments;
      //   }
      // )
      // this.apartmentService.getApartments();
  }

  logoutUser() {
    this.accountService.logout();
    this.router.navigate(["/apartments"]);
  }

}
