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
export class ApartmentListComponent implements OnInit, OnDestroy {
  apartments: Apartment[] = [];
  subscription: Subscription;

  constructor(private apartmentService: ApartmentService) { }

  ngOnInit(): void {
    this.subscription = this.apartmentService.apartmentListChangedEvent.subscribe(
      (apartments: Apartment[]) => {
        this.apartments = apartments;
      }
    )
    this.apartmentService.getApartments();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // openNewPage() {
  //   this.router.navigate(["/details"])
  // }

}
