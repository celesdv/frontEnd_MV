import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Flight } from 'src/app/interfaces/flight';
import { BudgetService } from 'src/app/service/budget.service';
import { ErrorService } from 'src/app/service/error.service';
import { FlightService } from 'src/app/service/flight.service';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css'],
})
export class FlightsComponent implements OnInit {
  @Output() newFlightEvent = new EventEmitter<number>();
  budgetId: number;
  loading = true;
  flights: Flight[] = [];

  constructor(
    private errorService: ErrorService,
    private toastr: ToastrService,
    private fligthService: FlightService,
    private budgetService: BudgetService
  ) {
    this.budgetId = budgetService.getId()
  }

  ngOnInit(): void {
    if(this.budgetId){
      this.getFligths();
    }
  }

  getFligths() {
    this.fligthService.getByBudget(this.budgetId).subscribe({
      next: (data: any) => {
        this.flights = data;
        this.loading = false;
        console.log(this.flights)
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  editFlight(id: number) {
    this.newFlightEvent.emit(id);
  }


  deleteFlight(id: number) {}
}
