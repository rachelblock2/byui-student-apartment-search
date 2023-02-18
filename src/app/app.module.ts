import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApartmentsComponent } from './apartments/apartments.component';
import { ApartmentListComponent } from './apartments/apartment-list/apartment-list.component';
import { ApartmentDetailComponent } from './apartments/apartment-detail/apartment-detail.component';
import { ApartmentItemComponent } from './apartments/apartment-list/apartment-item/apartment-item.component';
import { ApartmentSearchComponent } from './apartments/apartment-search/apartment-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSliderModule} from '@angular/material/slider';
import { ApartmentCarouselComponent } from './apartments/apartment-carousel/apartment-carousel.component';
import { LoginComponent } from './account/account-login/login.component';
import { AccountSignupComponent } from './account/account-signup/account-signup.component';

@NgModule({
  declarations: [
    AppComponent,
    ApartmentsComponent,
    ApartmentListComponent,
    ApartmentDetailComponent,
    ApartmentItemComponent,
    ApartmentSearchComponent,
    HeaderComponent,
    ApartmentCarouselComponent,
    LoginComponent,
    AccountSignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
