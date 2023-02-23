import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor( private router: Router,
    private accountService: AccountService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required])
    });
  }

  onSubmit(loginData) {
    this.accountService.login(loginData.value.email, loginData.value.password);
    this.router.navigate(['/apartments']);
  }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

  // onCancel() {
  //   this.router.navigate(['/apartments']);
  // }

  // }

}
