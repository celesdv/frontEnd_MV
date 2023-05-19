import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Booking } from 'src/app/interfaces/booking';
import { Income } from 'src/app/interfaces/income';
import { BookingService } from 'src/app/service/booking.service';
import { ErrorService } from 'src/app/service/error.service';
import { IncomeService } from 'src/app/service/income.service';
import { OutcomeService } from 'src/app/service/outcome.service';

@Component({
  selector: 'app-booking-status',
  templateUrl: './booking-status.component.html',
  styleUrls: ['./booking-status.component.css'],
})
export class BookingStatusComponent implements OnInit {
  loading = true;
  alert: Booking[] = [];
  warning: Booking[] = [];
  confirm: Booking[] = [];
  now: string[] = [];

  constructor(
    private errorService: ErrorService,
    private toastr: ToastrService,
    private bookingService: BookingService,
    private incomeService: IncomeService,
    private outcomeServide: OutcomeService,
    public router: Router,
  ) {
    for (let index = 0; index < 10; index++) {
      this.now.push(moment().add(index, 'days').format().substring(0, 10));
    }
  }

  ngOnInit(): void {
    this.getBookings();
  }

  getBookings() {
    this.bookingService.getBookingsOnly().subscribe({
      next: (data: Booking[]) => {
        this.loading = false;
        data.forEach((el: Booking) => {
          this.defineStatus(el);
        });
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  defineStatus(el: Booking) {
    if (el.id) {
      this.incomeService.getByBooking(el.id).subscribe({
        next: (data: Income[]) => {
          let now = new Date()
          let travel = new Date(el.travel_date)
          if (now.getTime() <= travel.getTime()) {
            if (data.length === 0) {
              this.warning.push(el);
            } else {
              if(this.now.includes(el.travel_date.substring(0,10)) && this.check(data) < el.total) {
                this.alert.push(el)
              } else {
                this.confirm.push(el)
              }
            }  
          }                  
        },
        error: (e: HttpErrorResponse) => {},
      });
    }
  }

  check(data: Income[]) {
    let totalIncomes = 0
    data.forEach(e => {
      totalIncomes = totalIncomes + e.total
    });
    console.log(totalIncomes)
    return totalIncomes
  }

  goToByBooking(id:number){
    this.router.navigateByUrl(`byBooking/${id}`);
  }
}
