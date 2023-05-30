import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Booking } from 'src/app/interfaces/booking';
import { Count } from 'src/app/interfaces/count';
import { Outcome } from 'src/app/interfaces/outcome';
import { Supplier } from 'src/app/interfaces/supplier';
import { User } from 'src/app/interfaces/user';
import { BookingService } from 'src/app/service/booking.service';
import { CountService } from 'src/app/service/count.service';
import { ErrorService } from 'src/app/service/error.service';
import { OutcomeService } from 'src/app/service/outcome.service';
import { SupplierService } from 'src/app/service/supplier.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-form-outcome',
  templateUrl: './form-outcome.component.html',
  styleUrls: ['./form-outcome.component.css'],
})
export class FormOutcomeComponent implements OnInit {
  loading: boolean = true;
  form: FormGroup;
  action: string = 'Agregar ';
  id: number;
  suppliers: Supplier[] = [];
  counts: Count[] = [];
  bookings: Booking[] = [];
  users: User[] = [];
  token = localStorage.getItem('token');
  userId: any;
  count!: Count;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private errorService: ErrorService,
    private aRoute: ActivatedRoute,
    private outcomeService: OutcomeService,
    private supplierService: SupplierService,
    private userService: UserService,
    private bookingService: BookingService,
    private countService: CountService
  ) {
    this.form = this.formBuilder.group({
      total: [0, [Validators.required]],
      total_usd: [0],
      currency: ['', [Validators.required]],
      date: ['', [Validators.required]],
      userId: [],
      countId: [, Validators.required],
      supplierId: [, Validators.required],
      bookingId: [],
      detail: [''],
    });
    this.id = Number(aRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getUserId();
    if (this.id != 0) {
      this.action = 'Editar ';
      this.getOutcome(this.id);
    } else {
      this.getSuppliers();
    }
  }

  getUserId() {
    if (this.token && this.token != '') {
      let user = JSON.parse(atob(this.token.split('.')[1]));
      this.userId = user.id;
    }
  }

  getSuppliers() {
    this.supplierService.getSuppliers().subscribe({
      next: (data: Supplier[]) => {
        this.suppliers = data;
        this.getBookings();
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }

  getUsers() {
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.getSuppliers();
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }

  getBookings() {
    this.bookingService.getBookingsOnly().subscribe({
      next: (data: Booking[]) => {
        this.bookings = data;
        this.loading = false;
        this.getCounts();
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  getCounts() {
    this.countService.getCounts().subscribe({
      next: (data: Count[]) => {
        this.counts = data;
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }

  getOutcome(id: number) {
    this.outcomeService.getById(id).subscribe({
      next: (data: Outcome) => {
        this.form.setValue({
          total: data.total,
          total_usd: data.total_usd,
          currency: data.currency,
          date: data.date.substring(0, 10),
          userId: data.userId,
          countId: data.countId,
          supplierId: data.supplierId,
          bookingId: data.bookingId,
          detail: data.detail,
        });
        this.getUsers();
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }

  accept() {
    this.loading = true;
    if (this.form.valid) {
      let tax = 0;

      if (this.form.value.currency === 'ARS') {
        this.counts.forEach((element) => {
          if (element.id == this.form.value.countId) {
            this.count = element;
            tax = (this.form.value.total * element.tax_outcome) / 100;
            if (element.tax_outcome > 0) this.createOutcome(tax);
          }
        });
      }

      const outcome: Outcome = {
        total: this.form.value.total,
        total_usd: this.form.value.total_usd,
        currency: this.form.value.currency,
        date: this.form.value.date + ' 00:00:00',
        userId: this.form.value.userId,
        countId: this.form.value.countId,
        supplierId: this.form.value.supplierId,
        bookingId: this.form.value.bookingId,
        detail: this.form.value.detail,
      };

      if (this.id !== 0) {
        outcome.id = this.id;
        outcome.userId = Number(this.form.value.userId);
        this.outcomeService.updateOutcome(outcome).subscribe({
          next: () => {
            this.toastr.success(
              `El egreso fue editado con exito`,
              'egreso editado'
            );
            this.loading = false;
            this.router.navigate(['/accounting']);
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        });
      } else {
        outcome.userId = this.userId;
        this.outcomeService.addOutcome(outcome).subscribe({
          next: () => {
            this.toastr.success(
              `El egreso fue registrado con exito`,
              'Egreso agregado'
            );
            this.loading = false;
            this.router.navigate(['/accounting']);
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        });
      }
    }
  }

  createOutcome(tax: number) {
    const outcomeD: Outcome = {
      total: tax,
      total_usd: 0,
      currency: 'ARS',
      date: this.form.value.date + ' 00:00:00',
      userId: this.userId,
      countId: this.form.value.countId,
      supplierId: 4,
      detail: 'Impuesto al Debito',
    };

    this.outcomeService.addOutcome(outcomeD).subscribe({
      next: () => {},
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }
}
