import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentSuggestionComponent } from './apartment-suggestion.component';

describe('ApartmentSuggestionComponent', () => {
  let component: ApartmentSuggestionComponent;
  let fixture: ComponentFixture<ApartmentSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApartmentSuggestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartmentSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
