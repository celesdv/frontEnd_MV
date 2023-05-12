import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Booking } from 'src/app/interfaces/booking';
import { Outcome } from 'src/app/interfaces/outcome';
import { Supplier } from 'src/app/interfaces/supplier';
import { BookingService } from 'src/app/service/booking.service';
import { ErrorService } from 'src/app/service/error.service';
import { OutcomeService } from 'src/app/service/outcome.service';
import { SupplierService } from 'src/app/service/supplier.service';

@Component({
  selector: 'app-by-supplier',
  templateUrl: './by-supplier.component.html',
  styleUrls: ['./by-supplier.component.css'],
})
export class BySupplierComponent implements OnInit {
  suppliers: Supplier[] = [];
  supplierId!: number;
  loading: boolean = false;
  supplierSelected!: Supplier;
  bookings: Booking[] = [];
  outcomes: Outcome[] = [];
  total = 0;
  totalOutcomes = 0;

  constructor(
    private errorService: ErrorService,
    private bookingService: BookingService,
    private outcomeService: OutcomeService,
    private supplierService: SupplierService
  ) {}

  ngOnInit(): void {
    this.getSuppliers();
  }

  getSuppliers() {
    this.supplierService.getSuppliers().subscribe({
      next: (data: Supplier[]) => {
        this.suppliers = data;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }

  onChange(e: any) {
    this.supplierId = e.value;
    this.total = 0;
    this.totalOutcomes = 0;
    this.bookings = [];
    this.outcomes = [];
    if (this.supplierId) {
      this.loading = true;
      this.getSupplier(this.supplierId);
    }
  }

  getSupplier(id: number) {
    this.supplierService.getById(id).subscribe({
      next: (data: Supplier) => {
        this.supplierSelected = data;
        this.getBookingsBySupplier(id);
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }

  getBookingsBySupplier(id: number) {
    this.bookingService.getBySupplier(id).subscribe({
      next: (data: Booking[]) => {
        this.bookings = data;
        this.bookings.forEach((element) => {
          this.total = this.total + element.total;
        });
        this.getOutcomesByClient(id);
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }

  getOutcomesByClient(id: number) {
    this.outcomeService.getBySupplier(id).subscribe({
      next: (data: Outcome[]) => {
        this.outcomes = data.reverse();
        this.outcomes.forEach((element) => {
          this.totalOutcomes = this.totalOutcomes + element.total;
        });
        this.total = this.total - this.totalOutcomes;
        this.loading = false
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }
}
