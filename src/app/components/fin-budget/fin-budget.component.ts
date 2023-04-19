import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Budget } from 'src/app/interfaces/budget';
import { BudgetService } from 'src/app/service/budget.service';
import { ErrorService } from 'src/app/service/error.service';

@Component({
  selector: 'app-fin-budget',
  templateUrl: './fin-budget.component.html',
  styleUrls: ['./fin-budget.component.css']
})
export class FinBudgetComponent implements OnInit {
  loading: boolean = false;
  budget?: Budget;
  id: number;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private budgetService: BudgetService,
    private errorService: ErrorService,
   
  ){
    this.id = budgetService.getId();
  }

  ngOnInit(): void {
    this.getBudget(this.id)
  }

  getBudget(id: number) {
    this.loading = true;
    this.budgetService.getById(id).subscribe({
      next: (data: any) => {
        this.loading = false;
        this.budget = data;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  finish() {    
    let value = 0;
    if (this.budget != undefined) {
      this.budget.accommodation?.forEach((element) => {
        if (!element.soft_delete) value = value + element.tax + element.value;
      });
      this.budget.assistance?.forEach((element) => {
        if (!element.soft_delete) value = value + element.tax + element.value;
      });
      this.budget.canneds?.forEach((element) => {
        if (!element.soft_delete) value = value + element.tax + element.value;
      });
      this.budget.excursions?.forEach((element) => {
        if (!element.soft_delete) value = value + element.tax + element.value;
      });
      this.budget.flights?.forEach((element) => {
        if (!element.soft_delete) value = value + element.tax + element.value;
      });
      this.budget.items?.forEach((element) => {
        if (!element.soft_delete) value = value + element.tax + element.value;
      });
      this.budget.transfers?.forEach((element) => {
        if (!element.soft_delete) value = value + element.tax + element.value;
      });
      this.budget.total = value;
      this.budgetService.updateBudget(this.budget).subscribe({
        next: () => {
          this.toastr.success(
            `El detalle del presupuesto fue finalizado con exito`,
            'Presupuesto finalizado'
          );
          this.loading = false;
          console.log()
          this.router.navigateByUrl(`/budgets/resumen/${this.id}`)
        },
        error: (e: HttpErrorResponse) => {
          this.errorService.msjError(e);
          this.loading = false;
        },
      });
    }
  }
}
