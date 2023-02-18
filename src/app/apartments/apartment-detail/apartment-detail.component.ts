import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Apartment } from '../apartment.model';
import { ApartmentService } from '../apartment.service';
declare var $: any;

@Component({
  selector: 'app-apartment-detail',
  templateUrl: './apartment-detail.component.html',
  styleUrls: ['./apartment-detail.component.css'],
})
export class ApartmentDetailComponent implements OnInit, AfterViewInit {
  apartment: Apartment = new Apartment('', '', '', '', '', '', [''], [''], 0);
  images: string[];
  id: string;
  walkTimeToSchool: string;
  driveTimeToSchool: string;

  constructor(
    private apartmentService: ApartmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.apartmentService.getApartment(this.id).subscribe((apartmentData) => {
        this.apartment = apartmentData.apartment;
        this.images = apartmentData.apartment.images;
        this.apartmentService.getWalkingDistance(this.apartment).subscribe((locationData) => {
          console.log(locationData);
          this.walkTimeToSchool = locationData.rows[0].elements[0].duration.text;
          console.log(this.walkTimeToSchool);
        })
        this.apartmentService.getDrivingDistance(this.apartment).subscribe((locationData) => {
          console.log(locationData);
          this.driveTimeToSchool = locationData.rows[0].elements[0].duration.text;
          console.log(this.driveTimeToSchool);
        })
      });
    });
  }

  ngAfterViewInit() {
    $('.apt-img-holder').carousel();
  }
}
