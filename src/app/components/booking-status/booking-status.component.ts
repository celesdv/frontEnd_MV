import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Booking } from 'src/app/interfaces/booking';
import { BookingService } from 'src/app/service/booking.service';
import { ErrorService } from 'src/app/service/error.service';

@Component({
  selector: 'app-booking-status',
  templateUrl: './booking-status.component.html',
  styleUrls: ['./booking-status.component.css']
})
export class BookingStatusComponent implements OnInit {
  loading = true;
  alert: Booking[] = [];
  warning: Booking[] = [];
  confirm: Booking[] = [];
  now: string[] = []

  constructor(
    private errorService: ErrorService,
    private toastr: ToastrService,
    private bookingService: BookingService
  ) {
    for (let index = 0; index < 10; index++) {
      this.now.push(moment().add(index, 'days').format().substring(0,10))
    }
  }

  ngOnInit(): void {
    this.getBookings()    
  }

  getBookings() {
    this.bookingService.getBookings().subscribe({
      next: (data: Booking[]) => {
        this.loading = false;
        data.forEach((el:Booking) => {
          if(this.now.includes(el.travel_date.substring(0,10))) {
            this.alert.push(el)
          } else {
            this.confirm.push(el)
          }
        });
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }  

}
