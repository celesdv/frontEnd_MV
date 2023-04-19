import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Budget } from 'src/app/interfaces/budget';
import { Order } from 'src/app/interfaces/order';
import { BudgetService } from 'src/app/service/budget.service';
import { ErrorService } from 'src/app/service/error.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-add-budget',
  templateUrl: './add-budget.component.html',
  styleUrls: ['./add-budget.component.css'],
})
export class AddBudgetComponent implements OnInit {
  item: string = 'init';
  orderId?: number;
  disable: boolean = true;
  loading: boolean = false;
  form: FormGroup;
  action: string = 'Iniciar';
  id: number;
  orders: Order[] = [];
  budget?: Budget;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private errorService: ErrorService,
    private aRoute: ActivatedRoute,
    private budgetService: BudgetService,
    private orderService: OrderService
  ) {
    this.form = this.formBuilder.group({
      detail: [''],
      orderId: [],
    });
    this.id = Number(aRoute.snapshot.paramMap.get('id'));
    this.orderId = orderService.getId();
  }

  ngOnInit(): void {
    console.log(this.orderId);
    if (this.id != 0) {
      this.disable = false;
      this.action = 'Editar ';
      this.budgetService.setId(this.id);
      this.getBudget(this.id);
    } else {
      this.getOrders();
      if (this.orderId != 0) {
        this.form.setValue({
          detail: '',
          orderId: this.orderId,
        });
      }
    }
  }

  getBudget(id: number) {
    this.loading = true;
    this.budgetService.getById(id).subscribe({
      next: (data: any) => {
        this.loading = false;
        this.form.setValue({
          orderId: data.orderId,
          detail: data.detail,
        });
        this.budget = data;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
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

  select(item: string) {
    this.item = item;
  }

  add() {
    this.loading = true;
    if (this.form.valid) {
      const budget: Budget = {
        detail: this.form.value.detail,
        orderId: this.form.value.orderId,
      };

      if (this.id !== 0) {
        budget.id = this.id;
        this.budgetService.updateBudget(budget).subscribe({
          next: () => {
            this.toastr.success(
              `El detalle del presupuesto fue editado con exito`,
              'Presupuesto editado'
            );
            this.loading = false;
            this.budgetService.setId(this.id);
            this.select('flight');
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        });
      } else {
        this.budgetService.addBudget(budget).subscribe({
          next: (data: Budget) => {
            this.toastr.success(
              `El presupuesto fue iniciado con exito`,
              'Presupuesto iniciado'
            );
            this.loading = false;
            this.disable = false;
            this.budgetService.setId(data.id!);
            this.select('flight');
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        });
      }
    }
  }

  goBack() {
    this.orderService.setId(0);
    this.router.navigateByUrl(`budgets`);
  }
 
}
