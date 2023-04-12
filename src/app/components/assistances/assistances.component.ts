import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Assistance } from 'src/app/interfaces/assistance';
import { AssistanceService } from 'src/app/service/assistance.service';
import { BudgetService } from 'src/app/service/budget.service';
import { ErrorService } from 'src/app/service/error.service';

@Component({
  selector: 'app-assistances',
  templateUrl: './assistances.component.html',
  styleUrls: ['./assistances.component.css'],
})
export class AssistancesComponent implements OnInit {
  @Output() newAssistanceEvent = new EventEmitter<number>();
  budgetId: number;
  loading = true;
  assistances: Assistance[] = [];

  constructor(
    private errorService: ErrorService,
    private toastr: ToastrService,
    private budgetService: BudgetService,
    private assistanceService: AssistanceService
  ) {
    this.budgetId = budgetService.getId();
  }

  ngOnInit(): void {
    if (this.budgetId) {
      this.getAssistances();
    }
  }

  getAssistances() {
    this.assistanceService.getByBudget(this.budgetId).subscribe({
      next: (data: Assistance[]) => {
        this.assistances = data;
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  editAssistance(id: number) {
    this.newAssistanceEvent.emit(id);
  }

  deleteAssistance(id: number) {
    this.loading = true;
    this.assistanceService.deleteAssistance(id).subscribe({
      next: () => {
        this.toastr.info('Registro Eliminado', 'Exito');
        this.getAssistances()
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }
}
