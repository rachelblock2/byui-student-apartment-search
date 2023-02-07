import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentItemComponent } from './apartment-item.component';

describe('ApartmentItemComponent', () => {
  let component: ApartmentItemComponent;
  let fixture: ComponentFixture<ApartmentItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApartmentItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartmentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
