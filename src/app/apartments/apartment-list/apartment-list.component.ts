import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { Apartment } from '../apartment.model';
import { ApartmentService } from '../apartment.service';
import { Distance } from '../distance.model';

@Component({
  selector: 'app-apartment-list',
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.css'],
})
export class ApartmentListComponent implements OnInit {
  error: string;
  apartments: Apartment[] = [];
  subscription: Subscription;
  distances: Distance[] = [];

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
        },
        (error: any) => {
          this.error = error.message;
        }
      );
    this.apartmentService.getApartments();
  }

  async selectFilter(event) {
    try {
      // Sort apartments on the page
      if (event.target.value === 'aptName') {
        this.apartments.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
      } else if (event.target.value === 'aptPrice') {
        this.apartments.sort((a, b) =>
          a.price > b.price ? 1 : b.price > a.price ? -1 : 0
        );
      }
      // else if (event.target.value === 'aptDriveDistance') {
      //   for (const apartment of this.apartments) {
      //     const locationData = await this.apartmentService.getDrivingDistance(apartment)
      //     console.log(locationData);
      // try {
      //   const distance = new Distance(
      //     apartment.name,
      //     locationData.rows[0].elements[0].duration.text
      //   );
      //   this.distances.push(distance);
      // } catch (error) {
      //   this.error = error.message;
      // }
      // }
      // console.log(JSON.stringify(this.distances));

      // this.apartments.sort((a, b) => {
      //   const aIndex = this.distances.findIndex(
      //     (distanceObj) => distanceObj.name === a.name
      //   );
      //   const bIndex = this.distances.findIndex(
      //     (distanceObj) => distanceObj.name === b.name
      //   );
      //   console.log(aIndex);
      //   console.log(bIndex);
      //   if (aIndex > bIndex) {
      //     return 1;
      //   } else if (bIndex > aIndex) {
      //     return -1;
      //   } else {
      //     return 0;
      //   }
      // });
      // console.log(this.apartments);

      // } else if (event.target.value === 'aptWalkDistance') {
      //   let distances = [];
      //   this.apartments.forEach(async (apartment) => {
      //     let distance = await this.apartmentService.getWalkingDistance(
      //       apartment
      //     );
      //     distances.push(distance);
      //   });
      //   console.log(distances);
      //   distances.sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));
      //   console.log(this.apartments);
      // }
    } catch (error) {
      this.error = error;
    }
  }

  closeDetails() {
    this.apartmentService.closeDetails();
  }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }
}
