import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { FooterComponent } from './components/footer/footer.component';
import { ClientsComponent } from './components/clients/clients.component';
import { TokenIntInterceptor } from './utils/token-int.interceptor';
import { UsersComponent } from './components/users/users.component';
import { CountsComponent } from './components/counts/counts.component';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { FormClientComponent } from './components/form-client/form-client.component';
import { FormCountComponent } from './components/form-count/form-count.component';
import { FormUserComponent } from './components/form-user/form-user.component';
import { FormSupplierComponent } from './components/form-supplier/form-supplier.component';
import { FormOrderComponent } from './components/form-order/form-order.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AddBudgetComponent } from './components/add-budget/add-budget.component';
import { BudgetComponent } from './components/budget/budget.component';
import { FormFlightComponent } from './components/form-flight/form-flight.component';
import { FormHotelComponent } from './components/form-hotel/form-hotel.component';
import { FormTransferComponent } from './components/form-transfer/form-transfer.component';
import { FormExcursionComponent } from './components/form-excursion/form-excursion.component';
import { FormCannedComponent } from './components/form-canned/form-canned.component';
import { FormAssistanceComponent } from './components/form-assistance/form-assistance.component';
import { FormSectionComponent } from './components/form-section/form-section.component';
import { FormAccommodationComponent } from './components/form-accommodation/form-accommodation.component';
import { FormExtraComponent } from './components/form-extra/form-extra.component';
import { FlightsComponent } from './components/flights/flights.component';
import { TransfersComponent } from './components/transfers/transfers.component';
import { AssistancesComponent } from './components/assistances/assistances.component';
import { ExcursionsComponent } from './components/excursions/excursions.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    SpinnerComponent,
    FooterComponent,
    ClientsComponent,
    UsersComponent,
    CountsComponent,
    SuppliersComponent,
    FormClientComponent,
    FormCountComponent,
    FormUserComponent,
    FormSupplierComponent,
    FormOrderComponent,
    OrdersComponent,
    AddBudgetComponent,
    BudgetComponent,
    FormFlightComponent,
    FormHotelComponent,
    FormTransferComponent,
    FormExcursionComponent,
    FormCannedComponent,
    FormAssistanceComponent,
    FormSectionComponent,
    FormAccommodationComponent,
    FormExtraComponent,
    FlightsComponent,
    TransfersComponent,
    AssistancesComponent,
    ExcursionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-center',
      progressBar:true
    }),
    NgxTippyModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenIntInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
