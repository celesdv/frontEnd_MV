import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Booking } from 'src/app/interfaces/booking';
import { BookingService } from 'src/app/service/booking.service';
import { ErrorService } from 'src/app/service/error.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  loading = true;
  bookings: Booking[] = [];

  constructor(
    private errorService: ErrorService,
    private toastr: ToastrService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.getBookings()      
  }

  getBookings() {
    this.bookingService.getBookings().subscribe({
      next: (data: Booking[]) => {
        this.bookings = data
        console.log(this.bookings)
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }  

  deleteBooking(id: number) {
    this.loading = true;
    this.bookingService.deleteBooking(id).subscribe({
      next: () => {
        this.toastr.info('Registro Eliminado', 'Exito');
        this.getBookings();
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }
}
