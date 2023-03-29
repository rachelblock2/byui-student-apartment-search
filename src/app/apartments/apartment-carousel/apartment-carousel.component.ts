import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Apartment } from '../apartment.model';
// import * as $ from "jquery";
declare const $: any;

@Component({
  selector: 'app-apartment-carousel',
  templateUrl: './apartment-carousel.component.html',
  styleUrls: ['./apartment-carousel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApartmentCarouselComponent implements AfterViewInit {
  @Input() apartment: Apartment;
  error: string;

  constructor() { }

  ngAfterViewInit(){
    try {
    $('#carouselExampleCaptions').carousel();
    } catch (error) {
      this.error = error;
    }
  }

}
