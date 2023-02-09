import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Apartment } from '../apartment.model';
declare const $: any;

@Component({
  selector: 'app-apartment-carousel',
  templateUrl: './apartment-carousel.component.html',
  styleUrls: ['./apartment-carousel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApartmentCarouselComponent implements AfterViewInit {
  @Input() apartment: Apartment;

  constructor() { }

  ngAfterViewInit(){
    $('#carouselExampleCaptions').carousel();
  }

}
