import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../account.model';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-account-signup',
  templateUrl: './account-signup.component.html',
  styleUrls: ['./account-signup.component.css']
})
export class AccountSignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor( private router: Router,
    private accountService: AccountService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      fname: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z]+$")]),
      lname: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z]+$")]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(7)])
    });
  }

  onSubmit({ value }: { value: User }) {
    if (this.signupForm.valid) {
      let newUser = new User('', value.fname, value.lname, value.email, value.password, '');
      this.accountService.signup(newUser);
    }
  }
}
