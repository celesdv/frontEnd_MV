import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/interfaces/order';
import { User } from 'src/app/interfaces/user';
import { ErrorService } from 'src/app/service/error.service';
import { OrderService } from 'src/app/service/order.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-form-order',
  templateUrl: './form-order.component.html',
  styleUrls: ['./form-order.component.css'],
})
export class FormOrderComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  id: number;
  action: string = 'Agregar ';
  users: User[] = [];
  token = localStorage.getItem('token');
  userId: any;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private errorService: ErrorService,
    private aRoute: ActivatedRoute,
    private orderService: OrderService,
    private userService: UserService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      date: ['', [Validators.required]],
      nights: [, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      detail: [''],
      toddler: [],
      child: [],
      teen: [],
      adult: [],
      senior: [],
      userId: [],
    });
    this.id = Number(aRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (this.id != 0) {
      this.action = 'Editar ';
      this.getOrder(this.id);
    }
    this.getUsers();
    this.getUserId();
  }

  getUserId() {
    if (this.token && this.token != '') {
      let user = JSON.parse(atob(this.token.split('.')[1]));
      this.userId = user.id;
    }
  }

  getUsers() {
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  getOrder(id: number) {
    this.loading = true;
    this.orderService.getById(id).subscribe({
      next: (data: Order) => {
        this.loading = false;
        this.form.setValue({
          name: data.name,
          destination: data.destination,
          date: data.date,
          nights: data.nights,
          email: data.email,
          phone: data.phone,
          detail: data.detail,
          toddler: data.toddler,
          child: data.child,
          teen: data.teen,
          adult: data.adult,
          senior: data.senior,
          userId: data.userId,
        });
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  accept() {
    this.loading = true;
    if (this.form.valid) {
      const order: Order = {
        name: this.form.value.name,
        destination: this.form.value.destination,
        date: this.form.value.date,
        nights: this.form.value.nights,
        email: this.form.value.email,
        phone: this.form.value.phone,
        detail: this.form.value.detail,
        toddler: this.form.value.toddler,
        child: this.form.value.child,
        teen: this.form.value.teen,
        adult: this.form.value.adult,
        senior: this.form.value.senior,
      };

      if (this.id !== 0) {
        order.id = this.id;
        order.userId = Number(this.form.value.userId);
        this.orderService.updateOrder(order).subscribe({
          next: () => {
            this.toastr.success(
              `El pedido a nombre de ${order.name} fue editado con exito`,
              'Pedido editado'
            );
            this.loading = false;
            this.router.navigate(['/orders']);
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        });
      } else {
        order.userId = this.userId;
        this.orderService.addOrder(order).subscribe({
          next: () => {
            this.toastr.success(
              `El pedido a nombre de ${order.name} fue agregado con exito`,
              'Pedido agregado'
            );
            this.loading = false;
            this.router.navigate(['/orders']);
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
