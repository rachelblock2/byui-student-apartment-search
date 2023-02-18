import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { Apartment } from '../apartment.model';
import { ApartmentService } from '../apartment.service';

@Component({
  selector: 'app-apartment-list',
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.css']
})
export class ApartmentListComponent implements OnInit {
  apartments: Apartment[] = [];
  subscription: Subscription;

  constructor(private route: ActivatedRoute, private apartmentService: ApartmentService) { }

  ngOnInit(): void {
    // if (this.route.snapshot.queryParamMap.get('apartments') != "") {
    //   console.log(this.route.snapshot);
    // } else {
      console.log('its empty when component loads in');
      this.subscription = this.apartmentService.apartmentListChangedEvent.subscribe(
        (apartments: Apartment[]) => {
          this.apartments = apartments;
        }
      )
      this.apartmentService.getApartments();
    // }
  }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

  // openNewPage() {
  //   this.router.navigate(["/details"])
  // }

}
