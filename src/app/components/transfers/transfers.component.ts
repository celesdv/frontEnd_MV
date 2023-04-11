import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Transfer } from 'src/app/interfaces/transfer';
import { BudgetService } from 'src/app/service/budget.service';
import { ErrorService } from 'src/app/service/error.service';
import { TransferService } from 'src/app/service/transfer.service';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.css']
})
export class TransfersComponent implements OnInit {
  @Output() newTransferEvent = new EventEmitter<number>();
  budgetId: number;
  loading = true;
  transfers: Transfer[] = [];

  constructor(
    private errorService: ErrorService,
    private toastr: ToastrService,
    private budgetService: BudgetService,
    private transferService: TransferService
  ) {
    this.budgetId = budgetService.getId()
  }

  ngOnInit(): void {
    if(this.budgetId){
      this.getTransfers();
    }
  }

  getTransfers() {
    this.transferService.getByBudget(this.budgetId).subscribe({
      next: (data: Transfer[]) => {
        this.transfers = data;
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });

  }

  editTransfer(id: number) {
    this.newTransferEvent.emit(id);
  }

  deleteTransfer(id: number) {
    this.loading = true;
    this.transferService.deleteTransfer(id).subscribe({
      next: () => {
        this.toastr.info('Registro Eliminado', 'Exito');
        this.getTransfers()
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }
}
