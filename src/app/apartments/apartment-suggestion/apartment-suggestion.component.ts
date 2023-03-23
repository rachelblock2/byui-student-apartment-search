import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-apartment-suggestion',
  templateUrl: './apartment-suggestion.component.html',
  styleUrls: ['./apartment-suggestion.component.css']
})
export class ApartmentSuggestionComponent implements OnInit {
  suggestionForm: FormGroup;
  message: string;

  constructor( private router: Router,
    private accountService: AccountService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    let token = this.accountService.getTokenCookie();
    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.suggestionForm = this.formBuilder.group({
        aptName: new FormControl("", [Validators.required])
      });
    }
  }

  onSubmit(suggestionData) {
    this.accountService.suggestApartment(suggestionData.value.aptName);
    this.router.navigate(['/apartment-suggestion']);
  }

}
