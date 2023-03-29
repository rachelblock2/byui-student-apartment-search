import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  error: string;
  jwtTokenCheck: boolean = false;
  subscription: Subscription;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getUser();
    this.subscription = this.accountService.cookieChangedEvent.subscribe(
      (boolean: boolean) => {
        this.jwtTokenCheck = boolean;
      },
      (error: any) => {
        this.error = error.message;
      }
    );
  }
}
