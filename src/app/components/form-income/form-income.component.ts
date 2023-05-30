import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Booking } from 'src/app/interfaces/booking';
import { Client } from 'src/app/interfaces/client';
import { Count } from 'src/app/interfaces/count';
import { Income } from 'src/app/interfaces/income';
import { Outcome } from 'src/app/interfaces/outcome';
import { User } from 'src/app/interfaces/user';
import { BookingService } from 'src/app/service/booking.service';
import { ClientService } from 'src/app/service/client.service';
import { CountService } from 'src/app/service/count.service';
import { ErrorService } from 'src/app/service/error.service';
import { IncomeService } from 'src/app/service/income.service';
import { OutcomeService } from 'src/app/service/outcome.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-form-income',
  templateUrl: './form-income.component.html',
  styleUrls: ['./form-income.component.css'],
})
export class FormIncomeComponent implements OnInit {
  loading: boolean = true;
  form: FormGroup;
  action: string = 'Agregar ';
  id: number;
  clients: Client[] = [];
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
    private incomeService: IncomeService,
    private clientService: ClientService,
    private userService: UserService,
    private bookingService: BookingService,
    private countService: CountService,
    private outcomeService: OutcomeService
  ) {
    this.form = this.formBuilder.group({
      total: [0, [Validators.required]],
      total_usd: [0],
      currency: ['', [Validators.required]],
      date: ['', [Validators.required]],
      userId: [],
      countId: [, Validators.required],
      clientId: [],
      bookingId: [],
      detail: [''],
    });
    this.id = Number(aRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getUserId();
    if (this.id != 0) {
      this.action = 'Editar ';
      this.getIncome(this.id);
    } else {
      this.getClients();
    }
  }

  getUserId() {
    if (this.token && this.token != '') {
      let user = JSON.parse(atob(this.token.split('.')[1]));
      this.userId = user.id;
    }
  }

  getClients() {
    this.clientService.getClients().subscribe({
      next: (data: Client[]) => {
        this.clients = data;
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
        this.getClients();
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

  getIncome(id: number) {
    this.incomeService.getById(id).subscribe({
      next: (data: Income) => {
        this.form.setValue({
          total: data.total,
          total_usd: data.total_usd,
          currency: data.currency,
          date: data.date.substring(0, 10),
          userId: data.userId,
          countId: data.countId,
          clientId: data.clientId,
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
            tax = (this.form.value.total * element.tax_income) / 100;
            if (element.tax_income > 0) this.createOutcome(tax);
          }
        });
      }

      const income: Income = {
        total: this.form.value.total,
        total_usd: this.form.value.total_usd,
        currency: this.form.value.currency,
        date: this.form.value.date + ' 00:00:00',
        userId: this.form.value.userId,
        countId: this.form.value.countId,
        clientId: this.form.value.clientId,
        bookingId: this.form.value.bookingId,
        detail: this.form.value.detail,
      };
      console.log(income.date);

      if (this.id !== 0) {
        income.id = this.id;
        income.userId = Number(this.form.value.userId);
        this.incomeService.updateIncome(income).subscribe({
          next: () => {
            this.toastr.success(
              `El ingreso fue editado con exito`,
              'Ingreso editado'
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
        income.userId = this.userId;
        this.incomeService.addIncome(income).subscribe({
          next: () => {
            this.toastr.success(
              `El ingreso fue registrado con exito`,
              'Ingreso agregado'
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
    let other = 0;
    let value = tax;
    let name = this.count.name.toLocaleLowerCase();

    if (
      this.count.tax_income > 5 &&
      (name.includes('mabel') || name.includes('verlino'))
    ) {
      let ib = (5 * 100) / this.count.tax_income;
      other = 100 - ib;

      const outcomeIB: Outcome = {
        total: (tax * ib) / 100,
        total_usd: 0,
        currency: 'ARS',
        date: this.form.value.date + ' 00:00:00',
        userId: this.userId,
        countId: this.form.value.countId,
        supplierId: 7,
        detail: 'Ingresos Brutos',
      };

      this.outcomeService.addOutcome(outcomeIB).subscribe({
        next: () => {},
        error: (e: HttpErrorResponse) => {
          this.errorService.msjError(e);
        },
      });
    }

    if (other != 0) value = (tax * other) / 100;

    const outcome: Outcome = {
      total: value,
      total_usd: 0,
      currency: 'ARS',
      date: this.form.value.date + ' 00:00:00',
      userId: this.userId,
      countId: this.form.value.countId,
      supplierId: 8,
      detail: 'Impuesto a los Débitos y Créditos',
    };

    this.outcomeService.addOutcome(outcome).subscribe({
      next: () => {},
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }
}
