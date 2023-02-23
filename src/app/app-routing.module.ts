import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from  '@angular/common/http';
import { ApartmentsComponent } from './apartments/apartments.component';
// import { ApartmentEditComponent } from './apartments/apartment-edit/apartment-edit.component';
import { ApartmentDetailComponent } from './apartments/apartment-detail/apartment-detail.component';
import { ApartmentListComponent } from './apartments/apartment-list/apartment-list.component';
import { ApartmentSearchComponent } from './apartments/apartment-search/apartment-search.component';
import { LoginComponent } from './account/account-login/login.component';
import { AccountSignupComponent } from './account/account-signup/account-signup.component';
import { AccountInfoComponent } from './account/account-info/account-info.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/apartments', pathMatch: 'full'},
  { path: 'apartments', component: ApartmentListComponent, children: [
    { path: 'details/:id', component: ApartmentDetailComponent}
  ]},
  { path: 'apartment-search', component: ApartmentSearchComponent},
  { path: 'login', component: LoginComponent},
  { path: 'my-account', component: AccountInfoComponent},
  { path: 'signup', component: AccountSignupComponent}
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule] 
})
export class AppRoutingModule { }
