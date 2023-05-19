import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Booking } from 'src/app/interfaces/booking';
import { Income } from 'src/app/interfaces/income';
import { Outcome } from 'src/app/interfaces/outcome';
import { BookingService } from 'src/app/service/booking.service';
import { ErrorService } from 'src/app/service/error.service';
import { IncomeService } from 'src/app/service/income.service';
import { OutcomeService } from 'src/app/service/outcome.service';

@Component({
  selector: 'app-by-booking',
  templateUrl: './by-booking.component.html',
  styleUrls: ['./by-booking.component.css'],
})
export class ByBookingComponent implements OnInit {
  bookings: Booking[] = [];
  bookingId!: number;
  loading: boolean = false;
  bookingSelected!: Booking;
  incomes: Income[] = [];
  outcomes: Outcome[] = [];
  total = 0;
  totalIncomes = 0;
  totalOutcomes = 0;
  datos: any[] = [];
  id:number  

  constructor(
    private errorService: ErrorService,
    private bookingService: BookingService,
    private incomeService: IncomeService,
    private outcomeService: OutcomeService,
    private aRoute: ActivatedRoute,
  ) {
    this.id = Number(aRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if(this.id!=0) {
      this.loading = true;
      this.getBooking(this.id)
    } else {
      this.getBookings();
    }
  }

  getBookings() {
    this.bookingService.getBookingsOnly().subscribe({
      next: (data: Booking[]) => {
        this.bookings = data;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }

  onChange(e: any) {
    this.bookingId = e.value;
    this.total = 0;
    this.totalIncomes = 0;
    this.totalOutcomes = 0;
    this.incomes = [];
    this.outcomes = [];
    this.datos = [];
    if (this.bookingId) {
      this.loading = true;
      this.getBooking(this.bookingId);
    }
  }

  getBooking(id: number) {
    this.bookingService.getById(id).subscribe({
      next: (data: Booking) => {
        this.bookingSelected = data;
        console.log(this.bookingSelected);
        this.total = this.bookingSelected.total
        this.getIncomesByBooking(id);
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }

  getIncomesByBooking(id: number) {
    this.incomeService.getByBooking(id).subscribe({
      next: (data: Income[]) => {
        this.incomes = data.reverse();
        this.incomes.forEach((element) => {
          this.datos.push(element);
          this.totalIncomes = this.totalIncomes + element.total;
        });
        this.total = this.total - this.totalIncomes
        this.getOutcomesByBooking(id)
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });    
  }

  getOutcomesByBooking(id: number) {
    this.outcomeService.getByBooking(id).subscribe({
      next: (data: Outcome[]) => {
        this.outcomes = data.reverse();
        this.outcomes.forEach((element) => {
          this.datos.push(element);
          this.totalOutcomes = this.totalOutcomes + element.total;
        });
        this.loading = false
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }
}
