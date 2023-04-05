import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Budget } from 'src/app/interfaces/budget';
import { BudgetService } from 'src/app/service/budget.service';
import { ErrorService } from 'src/app/service/error.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
  loading = true;
  budgets: any[] = [];
  url: any;

  constructor(
    private errorService: ErrorService,
    private toastr: ToastrService,
    public router: Router,
    private budgetService: BudgetService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.getBudgets();
  }

  getBudgets() {
    this.budgetService.getBudgets().subscribe({
      next: (data: any[]) => {
        this.budgets = data;
        this.loading = false;
        console.log(this.budgets)
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  deleteBudget(id: number){

  }

  editBudget(id: number, orderId:number) {
    this.orderService.setId(orderId)
    this.router.navigateByUrl(`budgets/form/${id}`)
  }

}
