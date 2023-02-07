import { Component, Input, OnInit } from '@angular/core';
import { Apartment } from '../../apartment.model';

@Component({
  selector: 'app-apartment-item',
  templateUrl: './apartment-item.component.html',
  styleUrls: ['./apartment-item.component.css']
})
export class ApartmentItemComponent implements OnInit {
  @Input() apartment: Apartment;

  constructor() { }

  ngOnInit(): void {
  }

}
