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
  apartment: Apartment = new Apartment('', '', '', '', '', [''], [''], 0);
  images: string[];
  id: string;

  constructor(
    private apartmentService: ApartmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.apartmentService.getApartment(this.id).subscribe((apartmentData) => {
        console.log(apartmentData);
        this.apartment = apartmentData.apartment;
        console.log(this.apartment);
        this.images = apartmentData.apartment.images;
      });
    });

    this.apartmentService.getDistance(this.apartment)
    // .subscribe((distanceData) => {
      // console.log(distanceData);
    // })
  }

  ngAfterViewInit() {
    $('.apt-img-holder').carousel();
  }
}
