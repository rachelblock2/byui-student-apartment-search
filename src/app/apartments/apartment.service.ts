import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { Apartment } from './apartment.model';

@Injectable({
  providedIn: 'root',
})
export class ApartmentService {
  apartmentListChangedEvent = new Subject<Apartment[]>();
  apartments: Apartment[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  // Sorts apartments alphabetically, then fires event on subject
  sortAndSend() {
    this.apartments.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );
    this.apartmentListChangedEvent.next(this.apartments.slice());
  }

  // Gets all apartments
  getApartments() {
    // Checks if apartments are loaded in through search query
    if (
      this.apartments.length > 0 ||
      (this.apartments.length === 0 && this.cookieService.get('searching'))
    ) {
      this.sortAndSend();
      this.cookieService.delete('searching');
      // Loads in full list of apartments
    } else {
      this.http
        .get<{ apartments: Apartment[] }>('http://localhost:3000/apartments/')
        .subscribe(
          (response) => {
            this.apartments = response.apartments;
            this.sortAndSend();
          },
          (error: any) => {
            return error.message;
          }
        );
    }
  }

  // Gets apartments based on user's queries
  getFilteredApartments(apartmentFilterData: {
    price;
    walkTimeToCollege;
    driveTimeToCollege;
    rating;
    aptGenderOptions;
    amenities;
  }) {
    this.http
      .get<{ apartments: Apartment[] }>(
        'http://localhost:3000/apartments/filtered',
        {
          params: {
            price: apartmentFilterData.price,
            walkTime: apartmentFilterData.walkTimeToCollege,
            driveTime: apartmentFilterData.driveTimeToCollege,
            rating: apartmentFilterData.rating,
            aptGenderOptions: apartmentFilterData.aptGenderOptions,
            amenities: apartmentFilterData.amenities,
          },
        }
      )
      .subscribe((response) => {
        this.apartments = response.apartments;
        this.sortAndSend();
      },
      (error: any) => {
        return error.message;
      });
  }

  // Gets amount of time walking between apartment and college
  getWalkingDistance(apartment: Apartment) {
    let location = encodeURIComponent(apartment.address.trim());
    return this.http.get<any>(
      'http://localhost:3000/apartments/distance/walking',
      { params: { location: location } }
    );
  }

  // Gets amount of time driving between apartment and college
  getDrivingDistance(apartment: Apartment) {
    let location = encodeURIComponent(apartment.address.trim());
    return this.http.get<any>(
      'http://localhost:3000/apartments/distance/driving',
      { params: { location: location } }
    );
  }

  // Gets individual apartment based on id
  getApartment(_id: string) {
    return this.http.get<{ message: string; apartment: Apartment }>(
      'http://localhost:3000/apartments/details/' + _id
    );
  }

  // Closes open modal of apartment details
  closeDetails() {
    this.router.navigate(['apartments']);
  }

  closeAcctDetails() {
    this.router.navigate(['my-account']);
  }

  addApartment(apartment: Apartment) {
    if (!apartment) {
      return;
    }

    // make sure _id of new apartment is empty
    apartment._id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string; apartment: Apartment }>(
        'http://localhost:3000/admin/addAptId',
        apartment,
        { headers: headers }
      )
      .subscribe((responseData) => {
        // add new apartment to apartments
        apartment._id = responseData.apartment._id;
        this.apartments.push(responseData.apartment);
        this.sortAndSend();
      },
      (error: any) => {
        return error.message;
      });
  }

  updateApartment(originalApartment: Apartment, newApartment: Apartment) {
    if (!originalApartment || !newApartment) {
      return;
    }

    const position = this.apartments.findIndex(
      (a) => a._id === originalApartment._id
    );
    if (position < 0) {
      return;
    }

    // Set _id of the new, updated apartment to the _id of the old apartment
    newApartment._id = originalApartment._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update database
    this.http
      .put(
        'http://localhost:3000/apartments/' + originalApartment._id,
        newApartment,
        { headers: headers }
      )
      .subscribe((responseData) => {
        this.apartments[position] = newApartment;
        this.sortAndSend();
      },
      (error: any) => {
        return error.message;
      });
  }

  deleteApartment(apartment: Apartment) {
    if (!apartment) {
      return;
    }

    const position = this.apartments.findIndex((a) => a._id === apartment._id);
    if (position < 0) {
      return;
    }

    // delete from database
    this.http
      .delete('http://localhost:3000/apartments/' + apartment._id)
      .subscribe((responseData) => {
        this.apartments.splice(position, 1);
        this.sortAndSend();
      },
      (error: any) => {
        return error.message;
      });
  }
}
