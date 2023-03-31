import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/interfaces/order';
import { BudgetService } from 'src/app/service/budget.service';
import { ErrorService } from 'src/app/service/error.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  loading = true;
  orders: Order[] = [];
  url: any;

  constructor(
    private errorService: ErrorService,
    private toastr: ToastrService,
    private orderService: OrderService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrders().subscribe({
      next: (data: Order[]) => {
        this.orders = data;
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  deleteOrder(id: number) {
    this.loading = true;
    this.orderService.deleteOrder(id).subscribe({
      next: () => {
        this.toastr.info('Registro Eliminado', 'Exito');
        this.getOrders();
      },
      error: (e: HttpErrorResponse) => {
        console.log(e);
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  toBudget(id: number) {
    this.orderService.setId(id)
    this.router.navigateByUrl(`budgets/form`);
  }
}
