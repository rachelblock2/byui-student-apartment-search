import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Apartment } from './apartment.model';

@Injectable({
  providedIn: 'root',
})
export class ApartmentService {
  apartmentListChangedEvent = new Subject<Apartment[]>();
  apartments: Apartment[] = [];

  constructor(private http: HttpClient) {}

  sortAndSend() {
    this.apartments.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );
    this.apartmentListChangedEvent.next(this.apartments.slice());
  }

  getApartments() {
    this.http
      .get<{ apartments: Apartment[] }>('http://localhost:3000/apartments/')
      .subscribe(
        (response) => {
          console.log(response);
          this.apartments = response.apartments;
            this.sortAndSend();
        },
        (error: any) => {
          console.log(error.message);
        }
      );
  }

  findFilteredApartments(apartmentFilterData) {
    if (!apartmentFilterData) {
      return;
    }

    // make sure _id of new apartment is empty
    // apartment._id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // send data to database to return apartments that match data
    // this.http
    //   .post<{ message: string; apartment: Apartment }>(
    //     'http://localhost:3000/apartments/',
    //     apartment,
    //     { headers: headers }
    //   )
    //   .subscribe((responseData) => {
    //     // add new apartment to apartments
    //     apartment._id = responseData.apartment._id;
    //     this.apartments.push(responseData.apartment);
    //     this.sortAndSend();
    //   });
  }
  // todo: create post method to submit the body of data, aka the data search filters to the backend,
  // which then you can use to filter the apartments via the find method, which will
  // also need to be a new endpoint on the backend

  getDistance() {
    return this.http.get('http://localhost:3000/apartments/distance');
  }

  getApartment(_id: string) {
    console.log(_id);
    return this.http.get<{ message: string; apartment: Apartment }>(
      'http://localhost:3000/apartments/details/' + _id
    );
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
        'http://localhost:3000/apartments/',
        apartment,
        { headers: headers }
      )
      .subscribe((responseData) => {
        // add new apartment to apartments
        apartment._id = responseData.apartment._id;
        this.apartments.push(responseData.apartment);
        this.sortAndSend();
      });
  }

  updateApartment(originalApartment: Apartment, newApartment: Apartment) {
    if (!originalApartment || !newApartment) {
      return;
    }

    console.log(originalApartment);
    console.log(newApartment);

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
        console.log(responseData);
        this.apartments[position] = newApartment;
        console.log(newApartment);
        this.sortAndSend();
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
      });
  }
}
