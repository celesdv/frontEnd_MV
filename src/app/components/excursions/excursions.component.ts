import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Excursion } from 'src/app/interfaces/excursion';
import { BudgetService } from 'src/app/service/budget.service';
import { ErrorService } from 'src/app/service/error.service';
import { ExcursionService } from 'src/app/service/excursion.service';

@Component({
  selector: 'app-excursions',
  templateUrl: './excursions.component.html',
  styleUrls: ['./excursions.component.css']
})
export class ExcursionsComponent implements OnInit {
  @Output() newExcursionEvent = new EventEmitter<number>();
  budgetId: number;
  loading = true;
  excursions: Excursion[] = [];

  constructor(
    private errorService: ErrorService,
    private toastr: ToastrService,
    private budgetService: BudgetService,
    private excursionService: ExcursionService
  ) {
    this.budgetId = budgetService.getId();
  }

  ngOnInit(): void {
    if (this.budgetId) {
      this.getExcursions();
    }
  }

  getExcursions() {
    this.excursionService.getByBudget(this.budgetId).subscribe({
      next: (data: Excursion[]) => {
        this.excursions = data;
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  editExcursion(id: number) {
    this.newExcursionEvent.emit(id);
  }

  deleteExcursion(id: number) {
    this.loading = true;
    this.excursionService.deleteExcursion(id).subscribe({
      next: () => {
        this.toastr.info('Registro Eliminado', 'Exito');
        this.getExcursions()
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

}
