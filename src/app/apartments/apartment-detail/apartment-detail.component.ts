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
  error: string;
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
  readableAmenities: string[];
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
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.apartmentService.getApartment(this.id).subscribe(
          (apartmentData) => {
            this.apartment = apartmentData.apartment;
            this.images = apartmentData.apartment.images;

            this.apartmentService.getWalkingDistance(this.apartment).subscribe(
              (locationData) => {
                this.walkTimeToSchool =
                  locationData.rows[0].elements[0].duration.text;
              },
              (error: any) => {
                this.error = error.message;
              }
            );

            this.apartmentService.getDrivingDistance(this.apartment).subscribe(
              (locationData) => {
                this.driveTimeToSchool =
                  locationData.rows[0].elements[0].duration.text;
              },
              (error: any) => {
                this.error = error.message;
              }
            );

            this.apartment.price.sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));

            this.readableAmenities = this.apartment.amenities.map((amenity) =>
              amenity === 'washerDryerInUnit'
                ? 'washer/dryer in unit'
                : amenity === 'washerDryerInComplex'
                ? 'washer/dryer in complex'
                : amenity === 'studyRoom'
                ? 'one or more study rooms available'
                : amenity === 'bbq'
                ? 'outdoor grill/bbq area'
                : amenity === 'hotTub'
                ? 'hot tub'
                : amenity === 'multipleFridges'
                ? 'two fridges inside apartment'
                : amenity === 'smartTv'
                ? 'smart TV'
                : amenity === 'tv'
                ? 'TV'
                : amenity === 'airConditioning'
                ? 'central air in apartment'
                : amenity === 'windowAir'
                ? 'window air conditioning available'
                : amenity === 'exerciseRoom'
                ? 'one or more exercise rooms'
                : amenity === 'theaterRoom'
                ? 'one or more theater rooms'
                : amenity === 'gameRoom'
                ? 'game tables available/gaming area'
                : amenity === 'elevator'
                ? 'elevator'
                : amenity === 'campusShuttle'
                ? 'campus shuttle'
                : amenity === 'porterPark'
                ? 'close to Porter Park'
                : amenity === 'temple'
                ? 'close to the Rexburg temple'
                : amenity === 'coveredParking'
                ? 'covered parking available for purchase'
                : amenity === 'uncoveredParking'
                ? 'uncovered parking available for purchase'
                : amenity === 'storageCloset'
                ? 'extra storage available'
                : amenity === 'bathroomRoom'
                ? 'bathrooms available within bedrooms'
                : amenity === 'singlePersonRooms'
                ? 'private rooms available for purchase'
                : amenity === 'insideEntry'
                ? 'inside apartment entry'
                : amenity === 'outsideEntry'
                ? 'outside apartment entry'
                : amenity === 'musicRoom'
                ? 'one or more pianos/music rooms available'
                : amenity === 'yogaRoom'
                ? 'one or more yoga rooms available'
                : amenity === 'exerciseCourt'
                ? 'outdoor exercise court'
                : amenity === 'balcony'
                ? 'apartments with balconies available'
                : amenity === 'firePit'
                ? 'one or more fire pits'
                : amenity === 'heatedFloors'
                ? 'heated floors'
                : amenity
            );
          },
          (error: any) => {
            this.error = error.message;
          }
        );
      },
      (error: any) => {
        this.error = error.message;
      }
    );
  }

  ngAfterViewInit() {
    $('.apt-img-holder').carousel();
  }

  addFavorite(apartment) {
    try {
      // Check if the user is logged in before allowing the user to add a favorite to their account
      let checkToken = this.accountService.getTokenCookie();
      if (!checkToken) {
        this.router.navigate(['/login']);
      } else {
        this.accountService.addFavorite(apartment);
        this.closeDetails();
      }
    } catch (error) {
      this.error = error;
    }
  }

  closeDetails() {
    // Close the details of the apartment modal
    this.apartmentService.closeDetails();
  }
}
