import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { Apartment } from '../apartment.model';
import { ApartmentService } from '../apartment.service';

@Component({
  selector: 'app-apartment-list',
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.css'],
})
export class ApartmentListComponent implements OnInit {
  apartments: Apartment[] = [];
  subscription: Subscription;
  distances: string[] = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apartmentService: ApartmentService
  ) {}

  ngOnInit(): void {
    // Get all the apartments
    this.subscription =
      this.apartmentService.apartmentListChangedEvent.subscribe(
        (apartments: Apartment[]) => {
          this.apartments = apartments;
        }
      );
    this.apartmentService.getApartments();
  }

  selectFilter(event) {
    // Sort apartments on the page
    if (event.target.value === "aptName") {
      this.apartments.sort((a, b) => (a.name > b.name) ? 1 :((b.name > a.name) ? -1 : 0));
      console.log(this.apartments);
    } else if (event.target.value === "aptPrice") {
      this.apartments.sort((a, b) => (a.price > b.price) ? 1 :((b.price > a.price) ? -1 : 0));
      console.log(this.apartments);
      
    } else if (event.target.value === "aptDriveDistance") {
      this.apartments.forEach(async (apartment) => {
        this.apartmentService.getDrivingDistance(apartment).subscribe((locationData) => {
          console.log(locationData.rows[0].elements[0].duration.text)
          this.distances.push(locationData.rows[0].elements[0].duration.text);
        })
      });
      this.distances.sort((a, b) => (a > b) ? 1 :((b > a) ? -1 : 0));

    } else if (event.target.value === "aptWalkDistance") {
      let distances = [];
      this.apartments.forEach(async (apartment) => {
        let distance = await this.apartmentService.getWalkingDistance(apartment);
        distances.push(distance);
      });
      console.log(distances);
      distances.sort((a, b) => (a > b) ? 1 :((b > a) ? -1 : 0));
      console.log(this.apartments);
    }
  }

  closeDetails() {
    this.apartmentService.closeDetails();
  }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }
}
