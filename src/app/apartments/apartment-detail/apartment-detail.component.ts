import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
  apartment: Apartment = new Apartment('', '', '', '', '', '', [''], [''], 0);
  images: string[];
  id: string;
  walkTimeToSchool: string;
  driveTimeToSchool: string;

  constructor(
    private apartmentService: ApartmentService,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    document.querySelector('.apartment-modal').classList.add('background');
    document.querySelector('.apartment-details').classList.add('show');
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

  addFavorite(apartment) {
    let checkToken = this.accountService.getTokenCookie();
    if (!checkToken) {
      this.router.navigate(['/login']);
    } else {
      console.log(apartment);
      this.accountService.addFavorite(apartment);
    }
  }

  closeDetails() {
    this.apartmentService.closeDetails();
  }
}
