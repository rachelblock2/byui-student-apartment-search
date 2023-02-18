import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApartmentService } from '../../apartments/apartment.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor( private router: Router,
    private apartmentService: ApartmentService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    });
  }

  onSubmit(aptSearchFilterData) {
    console.log(aptSearchFilterData.value);
    // this.subscription =
    //   this.apartmentService.apartmentListChangedEvent.subscribe(
    //     (apartments: Apartment[]) => {
    //       this.apartments = apartments;
    //       if (this.apartments.length != 0){
    //         console.log(this.apartments);
    //         // TODO: how to send the data to the list component, currently data comes through but only as object Object
    //         this.router.navigate(['/apartments'], {queryParams: {apartments: this.apartments}});
    //       }
    //     }
    //   );
    // this.apartmentService.getFilteredApartments(aptSearchFilterData.value);
  }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

  // onCancel() {
  //   this.router.navigate(['/apartments']);
  // }

  // }

}
