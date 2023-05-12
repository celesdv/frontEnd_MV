import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Booking } from 'src/app/interfaces/booking';
import { Budget } from 'src/app/interfaces/budget';
import { Client } from 'src/app/interfaces/client';
import { Pax } from 'src/app/interfaces/pax';
import { Supplier } from 'src/app/interfaces/supplier';
import { BookingService } from 'src/app/service/booking.service';
import { BudgetService } from 'src/app/service/budget.service';
import { ClientService } from 'src/app/service/client.service';
import { ErrorService } from 'src/app/service/error.service';
import { PaxService } from 'src/app/service/pax.service';
import { SupplierService } from 'src/app/service/supplier.service';

@Component({
  selector: 'app-form-booking',
  templateUrl: './form-booking.component.html',
  styleUrls: ['./form-booking.component.css'],
})
export class FormBookingComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  action: string = 'Agregar ';
  id: number;
  clients: Client[] = [];
  budgets: Budget[] = [];
  paxes: Pax[] = [];
  newP: any[] = [];
  show: boolean = true;
  suppliers: Supplier[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private errorService: ErrorService,
    private aRoute: ActivatedRoute,
    private bookingService: BookingService,
    private budgetService: BudgetService,
    private clientService: ClientService,
    private supplierService: SupplierService
  ) {
    this.form = this.formBuilder.group({
      reference: ['', [Validators.required]],
      detail: [''],
      travel_date: ['', [Validators.required]],
      budgetId: [, [Validators.required]],
      clientId: [, [Validators.required]],
      total: [, [Validators.required]],
      supplierId: []
    });
    this.id = Number(aRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (this.id != 0) {
      this.action = 'Editar ';
      this.getBooking(this.id);
    }
    this.getBudgets();
    this.getClients();
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
    })
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

  getBudgets() {
    this.budgetService.getBudgets().subscribe({
      next: (data: Budget[]) => {
        this.budgets = data;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }

  getBooking(id: number) {
    this.loading = true;
    this.bookingService.getById(id).subscribe({
      next: (data: Booking) => {
        this.form.setValue({
          reference: data.reference,
          detail: data.detail,
          travel_date: data.travel_date.substring(0, 10),
          budgetId: data.budgetId,
          clientId: data.clientId,
          total: data.total,
          supplierId: data.supplierId
        });
        data.paxes.forEach((e) => {
          if (!e.soft_delete) {
            this.paxes.push(e);
            this.newP.push(e.id);
          }
        });
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  addPax() {
    this.newP.push(0);
  }

  addNewPax(pax: Pax, index: number) {
    this.paxes.splice(index, 1, pax);
    console.log(this.paxes);
  }

  deleteP(index: number) {
    this.newP.splice(index, 1);
  }

  deletePax(id: number, index: number) {
    this.loading = true;
    this.paxes = this.paxes.filter((pax: Pax) => pax.id != id);
    this.newP.splice(index, 1);
    this.loading = false;
  }

  accept() {
    this.loading = true;
    if (this.form.valid) {
      const booking: Booking = {
        reference: this.form.value.reference,
        detail: this.form.value.detail,
        travel_date: this.form.value.travel_date,
        budgetId: this.form.value.budgetId,
        clientId: this.form.value.clientId,
        paxes: this.paxes,
        total: this.form.value.total,
        supplierId: this.form.value.supplierId
      };
      if (this.id !== 0) {
        booking.id = this.id;
        this.bookingService.updateBooking(booking).subscribe({
          next: () => {
            this.toastr.success(
              `La reserva ${booking.reference} fue editada con exito`,
              'Reserva editada'
            );
            this.loading = false;
            this.newP = [];
            this.router.navigate(['/bookings']);
            this.form.reset();
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        });
        this.show = true;
      } else {
        this.bookingService.addBooking(booking).subscribe({
          next: () => {
            this.toastr.success(
              `La reserva ${booking.reference} fue registrada con exito`,
              'Reserva agregada'
            );
            this.loading = false;
            this.newP = [];
            this.router.navigate(['/bookings']);
            this.form.reset();
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        });
      }
    }
  }
}
