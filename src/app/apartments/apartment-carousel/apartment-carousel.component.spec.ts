import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentCarouselComponent } from './apartment-carousel.component';

describe('ApartmentCarouselComponent', () => {
  let component: ApartmentCarouselComponent;
  let fixture: ComponentFixture<ApartmentCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApartmentCarouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartmentCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
