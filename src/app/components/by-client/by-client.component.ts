import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Booking } from 'src/app/interfaces/booking';
import { Client } from 'src/app/interfaces/client';
import { Income } from 'src/app/interfaces/income';
import { BookingService } from 'src/app/service/booking.service';
import { ClientService } from 'src/app/service/client.service';
import { ErrorService } from 'src/app/service/error.service';
import { IncomeService } from 'src/app/service/income.service';

@Component({
  selector: 'app-by-client',
  templateUrl: './by-client.component.html',
  styleUrls: ['./by-client.component.css'],
})
export class ByClientComponent implements OnInit {
  clients: Client[] = [];
  clientId!: number;
  loading: boolean = false;
  clientSelected!: Client;
  bookings: Booking[] = [];
  incomes: Income[] = [];
  total = 0;
  totalIncomes = 0;

  constructor(
    private errorService: ErrorService,
    private clientService: ClientService,
    private bookingService: BookingService,
    private incomeService: IncomeService
  ) {}

  ngOnInit(): void {
    this.getClients();
  }

  getClients() {
    this.clientService.getClients().subscribe({
      next: (data: Client[]) => {
        this.clients = data;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }

  onChange(e: any) {
    this.clientId = e.value;
    this.total = 0;
    this.totalIncomes = 0;
    this.bookings = [];
    this.incomes = [];
    if (this.clientId) {
      this.loading = true;
      this.getClient(this.clientId);
    }
  }

  getClient(id: number) {
    this.clientService.getById(id).subscribe({
      next: (data: Client) => {
        this.clientSelected = data;
        this.getBookingsByClient(id);
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }

  getBookingsByClient(id: number) {
    this.bookingService.getByClient(id).subscribe({
      next: (data: Booking[]) => {
        this.bookings = data;
        this.bookings.forEach((element) => {
          this.total = this.total + element.total;
        });
        this.getIncomesByClient(id);
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }

  getIncomesByClient(id: number) {
    this.incomeService.getByClient(id).subscribe({
      next: (data: Income[]) => {
        this.incomes = data.reverse();
        this.incomes.forEach((element) => {
          this.totalIncomes = this.totalIncomes + element.total;
        });
        this.total = this.total - this.totalIncomes;
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }
}
