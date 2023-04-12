import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Canned } from 'src/app/interfaces/canned';
import { BudgetService } from 'src/app/service/budget.service';
import { CannedService } from 'src/app/service/canned.service';
import { ErrorService } from 'src/app/service/error.service';

@Component({
  selector: 'app-canneds',
  templateUrl: './canneds.component.html',
  styleUrls: ['./canneds.component.css'],
})
export class CannedsComponent implements OnInit {
  @Output() newCannedEvent = new EventEmitter<number>();
  budgetId: number;
  loading = true;
  canneds: Canned[] = [];

  constructor(
    private errorService: ErrorService,
    private toastr: ToastrService,
    private budgetService: BudgetService,
    private cannedService: CannedService
  ) {
    this.budgetId = budgetService.getId();
  }

  ngOnInit(): void {
    if (this.budgetId) {
      this.getCanneds();
    }
  }

  getCanneds() {
    this.cannedService.getByBudget(this.budgetId).subscribe({
      next: (data: Canned[]) => {
        this.canneds = data;
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  editCanned(id: number) {
    this.newCannedEvent.emit(id);
  }

  deleteCanned(id: number) {
    this.loading = true;
    this.cannedService.deleteCanned(id).subscribe({
      next: () => {
        this.toastr.info('Registro Eliminado', 'Exito');
        this.getCanneds();
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }
}
