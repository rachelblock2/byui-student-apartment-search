import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Apartment } from '../apartment.model';
import { ApartmentService } from '../apartment.service';

@Component({
  selector: 'app-apartment-search',
  templateUrl: './apartment-search.component.html',
  styleUrls: ['./apartment-search.component.css']
})
export class ApartmentSearchComponent implements OnInit {
  apartment: Apartment;
  // originalApartment: Apartment;
  // editMode: boolean = false;
  searchForm: FormGroup;
  amenities: Array<any> = [
    { name: 'Washer/Dryer in unit', value: 'washerDryerInUnit' },
    { name: 'Study Rooms', value: 'studyRooms' },
    { name: 'BBQ Area', value: 'bbq' },
    { name: 'Hot Tub', value: 'hotTub' },
    { name: 'Multiple Fridges', value: 'multipleFridges' },
    { name: 'Smart TV', value: 'smartTv' },
    { name: 'Air Conditioning', value: 'airConditioning' },
    { name: 'Exercise Room', value: 'exerciseRoom' },
    { name: 'Elevator', value: 'elevator' },
    { name: 'Close to Porter Park', value: 'porterPark' },
    { name: 'Close to Temple', value: 'temple' },
    { name: 'Covered Parking', value: 'coveredParking' },
    { name: 'Uncovered Parking', value: 'uncoveredParking' },
    { name: 'Extra Storage Closet', value: 'storageCloset' },
    { name: 'Pantry', value: 'pantry' },
    { name: 'Dishwasher', value: 'dishwasher' },
    { name: 'Vanity', value: 'vanity' },
    { name: 'Room Bathroom', value: 'bathroomRoom' },
    { name: 'Single Person Rooms', value: 'singlePersonRooms' },
    { name: 'Inside Apartment Entry', value: 'insideEntry' },
    { name: 'Outside Apartment Entry', value: 'outsideEntry' },
    { name: 'Music Room', value: 'musicRoom' }
  ];

  id: string;

  constructor(private router: Router, 
    private route: ActivatedRoute, 
    private apartmentService: ApartmentService,
    private formBuilder: FormBuilder) {
    }
    
    ngOnInit() {
      this.searchForm = this.formBuilder.group({
        price: new FormControl(100, [Validators.min(100)]),
        driveTimeToCollege: new FormControl(1, [Validators.min(1)]),
        walkTimeToCollege: new FormControl(1, [Validators.min(1)]),
        reviewStars: new FormControl(1, [Validators.min(1)]),
        checkArray: this.formBuilder.array([], [Validators.required])
      })
    }

    onCheckboxChange(e) {
      const checkArray: FormArray = this.searchForm.get('checkArray') as FormArray;
      if (e.target.checked) {
        checkArray.push(new FormControl(e.target.value));
      } else {
        let i: number = 0;
        checkArray.controls.forEach((item: FormControl) => {
          if (item.value == e.target.value) {
            checkArray.removeAt(i);
            return;
          }
          i++;
        });
      }
    }
    // this.searchForm = new FormGroup({
    //   'courseName': new FormControl(null, [Validators.required]),
    //   'apartmentName': new FormControl(null, [Validators.required]),
    //   'dueDate': new FormControl(null, [Validators.required]),
    //   'priority': new FormControl("Medium", [Validators.required]),
    //   'color': new FormControl(null),
    //   'notes': new FormControl(null)
    // });
    
  //   this.searchForm.statusChanges.subscribe(
  //     (status) => console.log(status)
  //   );

  //   this.route.params.subscribe(
  //     (params: Params) => {
  //       this.id = params['id'];

  //       if (!this.id) {
  //         this.editMode = false;
  //         return
  //       }

  //       this.apartmentService.getApartment(this.id)
  //       .subscribe(apartmentData => {
  //         this.originalApartment = apartmentData.apartment;
  
  //         if (!this.originalApartment) {
  //           return
  //         }
          
  //         this.editMode = true;
  //         this.apartment = JSON.parse(JSON.stringify(this.originalApartment));
          
  //         this.searchForm.setValue({'courseName': this.apartment?.courseName, 
  //         'apartmentName': this.apartment?.apartmentName,
  //         'dueDate': formatDate(this.apartment.dueDate, 'yyyy-MM-dd', 'en'),
  //         'priority': this.apartment?.priority,
  //         'color': this.apartment?.color,
  //         'notes': this.apartment?.notes})
  //       });
  //     }
  //   );

    
  //   // this.searchForm.courseName.setValue();
  // } 
  
  // onSubmit(aptSearchFilterData) {
  onSubmit(aptSearchFilterData) {
    console.log(this.searchForm.value);
    // let value = form.value;
    // let aptSearchFilterData = new Apartment('', value.name, value.address, value.dueDate, value.priority, value.color, value.notes);
    
    // this.apartmentService.findFilteredApartments(aptSearchFilterData);

    // this.router.navigate(['/apartments']);
  }

  // onCancel() {
  //   this.router.navigate(['/apartments']);
  // }

// }

}