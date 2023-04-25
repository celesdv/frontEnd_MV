import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Accommodation } from 'src/app/interfaces/accommodation';
import { AccommodationService } from 'src/app/service/accommodation.service';
import { BudgetService } from 'src/app/service/budget.service';
import { ErrorService } from 'src/app/service/error.service';

@Component({
  selector: 'app-accommodations',
  templateUrl: './accommodations.component.html',
  styleUrls: ['./accommodations.component.css'],
})
export class AccommodationsComponent implements OnInit {
  @Output() newAccommodationEvent = new EventEmitter<number>();
  budgetId: number;
  loading = true;
  accommodations: Accommodation[] = [];

  constructor(
    private errorService: ErrorService,
    private toastr: ToastrService,
    private budgetService: BudgetService,
    private accommodationService: AccommodationService
  ) {
    this.budgetId = budgetService.getId();
  }

  ngOnInit(): void {
    if (this.budgetId) {
      this.getAccommodations();
    }
  }

  getAccommodations() {
    this.accommodationService.getByBudget(this.budgetId).subscribe({
      next: (data: any) => {
        this.accommodations = data;
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  editAccommodation(id: number) {
    this.newAccommodationEvent.emit(id);
  }

  deleteAccommodation(id: number) {
    this.loading = true;
    this.accommodationService.deleteAccommodation(id).subscribe({
      next: () => {
        this.toastr.info('Registro Eliminado', 'Exito');
        this.getAccommodations();
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }
}
