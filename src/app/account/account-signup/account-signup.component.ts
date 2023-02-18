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
      fname: new FormControl("", [Validators.required]),
      lname: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    });
  }

  onSubmit({ value }: { value: User }) {
    let newUser = new User('', value.fname, value.lname, value.email, value.password);
    this.accountService.signup(newUser);

    // this.subscription =
    //   this.apartmentService.apartmentListChangedEvent.subscribe(
    //     (apartments: Apartment[]) => {
    //       this.apartments = apartments;
    //       if (this.apartments.length != 0){
    //         console.log(this.apartments);
    //         // TODO: how to send the data to the list component, currently data comes through but only as object Object
    //         this.router.navigate(['/apartments']);
    //       }
    //     }
    //   );
    // this.apartmentService.getFilteredApartments(aptSearchFilterData.value);
    this.router.navigate(['/account']);
  }
}
