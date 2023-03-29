import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { Apartment } from '../apartment.model';
import { ApartmentService } from '../apartment.service';

@Component({
  selector: 'app-apartment-search',
  templateUrl: './apartment-search.component.html',
  styleUrls: ['./apartment-search.component.css'],
})
export class ApartmentSearchComponent implements OnInit {
  error: string;
  subscription: Subscription;
  apartments: Apartment[] = [];
  searchForm: FormGroup;
  amenities: Array<any> = [
    { name: 'Washer/Dryer in Unit', value: 'washerDryerInUnit' },
    { name: 'Washer/Dryer in Complex', value: 'washerDryerInComplex' },
    { name: 'Study Room', value: 'studyRoom' },
    { name: 'BBQ Area', value: 'bbq' },
    { name: 'Hot Tub', value: 'hotTub' },
    { name: 'Pool', value: 'pool' },
    { name: 'Multiple Fridges', value: 'multipleFridges' },
    { name: 'Smart TV', value: 'smartTv' },
    { name: 'TV', value: 'tv' },
    { name: 'Air Conditioning', value: 'airConditioning' },
    { name: 'Window Air Conditioning', value: 'windowAir' },
    { name: 'Exercise Room', value: 'exerciseRoom' },
    { name: 'Theater Room', value: 'theaterRoom' },
    { name: 'Game Room', value: 'gameRoom' },
    { name: 'Elevator', value: 'elevator' },
    { name: 'Campus Shuttle', value: 'campusShuttle' },
    { name: 'Close to Porter Park', value: 'porterPark' },
    { name: 'Close to Temple', value: 'temple' },
    { name: 'Covered Parking', value: 'coveredParking' },
    { name: 'Uncovered Parking', value: 'uncoveredParking' },
    { name: 'Extra Storage Closet', value: 'storageCloset' },
    { name: 'Clubhouse', value: 'clubhouse' },
    { name: 'Pantry', value: 'pantry' },
    { name: 'Dishwasher', value: 'dishwasher' },
    { name: 'Vanity', value: 'vanity' },
    { name: 'Room Bathroom', value: 'bathroomRoom' },
    { name: 'Single Person Rooms', value: 'singlePersonRooms' },
    { name: 'Inside Apartment Entry', value: 'insideEntry' },
    { name: 'Outside Apartment Entry', value: 'outsideEntry' },
    { name: 'Music Room', value: 'musicRoom' },
    { name: 'Yoga Room', value: 'yogaRoom' },
    { name: 'Outdoor Exercise Court', value: 'exerciseCourt' },
    { name: 'Apartment Balcony', value: 'balcony' },
    { name: 'Fire Pit', value: 'firePit' },
    { name: 'Heated Floors', value: 'heatedFloors' },
  ];
  aptGenderOptions: string[] = ['Women', 'Men'];

  constructor(
    private router: Router,
    private apartmentService: ApartmentService,
    private formBuilder: FormBuilder,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      price: new FormControl(0, [Validators.min(100)]),
      driveTimeToCollege: new FormControl(0, [Validators.min(1)]),
      walkTimeToCollege: new FormControl(0, [Validators.min(1)]),
      rating: new FormControl(0, [Validators.min(1)]),
      aptGenderOptions: this.formBuilder.array([], [Validators.required]),
      amenities: this.formBuilder.array([], [Validators.required]),
    });
  }

  onCheckboxAptGenderChange(e) {
    try {
      // Add checked gender to search query
      const aptGenderOptions: FormArray = this.searchForm.get(
        'aptGenderOptions'
      ) as FormArray;
      if (e.target.checked) {
        aptGenderOptions.push(new FormControl(e.target.value));
      } else {
        // Remove checked amenities to search query
        let i: number = 0;
        aptGenderOptions.controls.forEach((item: FormControl) => {
          if (item.value == e.target.value) {
            aptGenderOptions.removeAt(i);
            return;
          }
          i++;
        });
      }
    } catch (error) {
      this.error = error;
    }
  }

  onCheckboxAmenitiesChange(e) {
    try {
      // Add checked amenities to search query
      const amenities: FormArray = this.searchForm.get(
        'amenities'
      ) as FormArray;
      if (e.target.checked) {
        amenities.push(new FormControl(e.target.value));
      } else {
        // Remove checked amenities to search query
        let i: number = 0;
        amenities.controls.forEach((item: FormControl) => {
          if (item.value == e.target.value) {
            amenities.removeAt(i);
            return;
          }
          i++;
        });
      }
    } catch (error) {
      this.error = error;
    }
  }

  onSubmit(aptSearchFilterData) {
    try {
      // Submit user selected values in search query
      this.subscription =
        this.apartmentService.apartmentListChangedEvent.subscribe(
          (apartments: Apartment[]) => {
            this.apartments = apartments;
            // Differentiates between searched apartments in apartment list component and full list
            this.cookieService.set('searching', 'true');
            this.router.navigate(['/apartments']);
          },
          (error: any) => {
            this.error = error.message;
          }
        );
      this.apartmentService.getFilteredApartments(aptSearchFilterData.value);
    } catch (error) {
      this.error = error;
    }
  }

}
