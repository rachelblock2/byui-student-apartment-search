import { Component, Input, OnInit } from '@angular/core';
import { Apartment } from '../../apartment.model';

@Component({
  selector: 'app-apartment-item',
  templateUrl: './apartment-item.component.html',
  styleUrls: ['./apartment-item.component.css'],
})
export class ApartmentItemComponent implements OnInit {
  @Input() apartment: Apartment;

  constructor() {}

  ngOnInit(): void {
    this.apartment.price.sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));
    // this.apartment.images.forEach((image) => {
    //   const fileReader = new FileReader();
    //   fileReader.readAsDataURL(image)
    //   fileReader.onload = () => {
    //     let base64data = fileReader.result;
    //     console.log(base64data)
    //   }
    // })
  }
}
