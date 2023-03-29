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
    } else if (event.target.value === 'aptDriveDistance') {
      for (const apartment of this.apartments) {
        this.apartmentService
          .getDrivingDistance(apartment)
          .subscribe((locationData) => {
            try {
              const distance = new Distance(
                apartment.name,
                locationData.rows[0].elements[0].duration.text,
              );
              // console.log(locationData.rows[0].elements[0].duration.text)
              this.distances.push(distance);
            } catch (error) {
              this.error = error.message;
            }
          },
          (error: any) => {
            this.error = error.message;
          });
      }
      // this.apartments.forEach(async (apartment) => {
      //   this.apartmentService
      //     .getDrivingDistance(apartment)
      //     .subscribe((locationData) => {
      //       console.log(typeof locationData.rows[0].elements[0].duration.text)
      //       // try {
      //       //   const distance = new Distance({
      //       //     name: apartment.name,
      //       //     distance: locationData.rows[0].elements[0].duration.text
      //       // });
      //       //   // console.log(locationData.rows[0].elements[0].duration.text)
      //       //   this.distances.push(distance);
      //       // } catch (error) {
      //       //   console.log(error);
      //       // }
      //     });

      // console.log(this.distances);
      // this.distances.forEach((element) => {
      //   console.log(element.name);
      // });

      // this.distances.sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));
      // this.apartments.sort((a, b) => {
      // this.distances.forEach((distanceObj) => {
      //   console.log(distanceObj);
      //   console.log(Object.values(distanceObj));
      //   // if (distanceObj.name === a.name) {
      //   //   this.distances.indexOf(distanceObj.name)
      //   // }
      // });
        console.log(JSON.stringify(this.distances));
      // });
      this.apartments.sort((a, b) => {
        const aIndex = this.distances.findIndex(
          (distanceObj) => distanceObj.name === a.name
        );
        const bIndex = this.distances.findIndex(
          (distanceObj) => distanceObj.name === b.name
        );
        console.log(aIndex);
        console.log(bIndex);
        if (aIndex > bIndex) {
          return 1;
        } else if (bIndex > aIndex) {
          return -1;
        } else {
          return 0;
        }
      });
      console.log(this.apartments);
      // this.distances.sort((a, b) =>
      //   a.distance > b.distance ? 1 : b.distance > a.distance ? -1 : 0
      // );
      // console.log(JSON.stringify(this.distances));
      // for (let element of this.distances) {
      //   console.log(element);
      // }
      // // return this.distances.indexOf(a.name) - this.distances.indexOf(b.name);
      // // })

      // console.log(
      //   this.distances.findIndex(
      //     (distanceObj) => distanceObj.name === 'Centre Square'
      //   )
      // );
      // // this.apartments.sort((a, b) => this.distances.indexOf(this.distances.findIndex(distanceObj => distanceObj.name === a.name)) - this.distances.indexOf(this.distances.findIndex(distanceObj => distanceObj.name === b.name)));
      // console.log(this.apartments);
      // this.distances.forEach((distanceObj) => {
      //   this.apartments.find(apartment => {
      //     if (distanceObj.apartment.name === apartment.name) {
      //       console.log(apartment.name);
      //       this.apartments.sort((a, b) => (a.price > b.price) ? 1 :((b.price > a.price) ? -1 : 0));
      //     }
      //   })
      // })
    } else if (event.target.value === 'aptWalkDistance') {
      let distances = [];
      this.apartments.forEach(async (apartment) => {
        let distance = await this.apartmentService.getWalkingDistance(
          apartment
        );
        distances.push(distance);
      });
      console.log(distances);
      distances.sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));
      console.log(this.apartments);
    }
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
