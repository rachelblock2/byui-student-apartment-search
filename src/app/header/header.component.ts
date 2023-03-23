import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  jwtTokenCheck: boolean = false;
  subscription: Subscription;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.subscription = this.accountService.cookieChangedEvent.subscribe(
      (boolean: boolean) => {
        this.jwtTokenCheck = boolean;
      }
    );
    console.log(this.jwtTokenCheck);
    // if (this.accountService.getTokenCookie() !== "") {
    //   this.jwtTokenCheck = true;
    // } else {
    //   this.jwtTokenCheck = false;
    // }
  }
}
