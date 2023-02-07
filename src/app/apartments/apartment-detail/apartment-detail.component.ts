import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Apartment } from '../apartment.model';
import { ApartmentService } from '../apartment.service';

@Component({
  selector: 'app-apartment-detail',
  templateUrl: './apartment-detail.component.html',
  styleUrls: ['./apartment-detail.component.css']
})
export class ApartmentDetailComponent implements OnInit {
  apartment: Apartment = new Apartment("","","","","",[""],[""],0);
  id: string;

  constructor(private apartmentService: ApartmentService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.apartmentService.getApartment(this.id)
        .subscribe(apartmentData => {
          console.log(apartmentData);
          this.apartment = apartmentData.apartment;
          console.log(this.apartment);
        });
    }
  );
  }

}
