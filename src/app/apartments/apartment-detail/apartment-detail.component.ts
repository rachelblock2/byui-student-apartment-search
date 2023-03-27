import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { Apartment } from '../apartment.model';
import { ApartmentService } from '../apartment.service';
declare var $: any;

@Component({
  selector: 'app-apartment-detail',
  templateUrl: './apartment-detail.component.html',
  styleUrls: ['./apartment-detail.component.css'],
})
export class ApartmentDetailComponent implements OnInit, AfterViewInit {
  apartment: Apartment = new Apartment(
    '',
    '',
    '',
    [''],
    '',
    '',
    '',
    0,
    [''],
    [''],
    [0]
  );
  images: string[];
  id: string;
  walkTimeToSchool: string;
  driveTimeToSchool: string;
  jwtTokenCheck: boolean = false;
  subscription: Subscription;

  constructor(
    private apartmentService: ApartmentService,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get the individual apartment with the details, including the times between the college and apartment
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.apartmentService.getApartment(this.id).subscribe((apartmentData) => {
        this.apartment = apartmentData.apartment;
        this.images = apartmentData.apartment.images;
        this.apartmentService
          .getWalkingDistance(this.apartment)
          .subscribe((locationData) => {
            this.walkTimeToSchool =
              locationData.rows[0].elements[0].duration.text;
          });
        this.apartmentService
          .getDrivingDistance(this.apartment)
          .subscribe((locationData) => {
            this.driveTimeToSchool =
              locationData.rows[0].elements[0].duration.text;
          });
        this.apartment.price.sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));
      });
    });
    // this.accountService.getUser();
    // this.subscription = this.accountService.cookieChangedEvent.subscribe(
    //   (boolean: boolean) => {
    //     this.jwtTokenCheck = boolean;
    //   }
    // );
    // console.log(this.jwtTokenCheck);
  }

  ngAfterViewInit() {
    $('.apt-img-holder').carousel();
  }

  addFavorite(apartment) {
    // Check if the user is logged in before allowing the user to add a favorite to their account
    let checkToken = this.accountService.getTokenCookie();
    if (!checkToken) {
      this.router.navigate(['/login']);
    } else {
      console.log(apartment);
      this.accountService.addFavorite(apartment);
      this.closeDetails();
    }
  }

  closeDetails() {
    // Close the details of the apartment modal
    this.apartmentService.closeDetails();
  }
}
