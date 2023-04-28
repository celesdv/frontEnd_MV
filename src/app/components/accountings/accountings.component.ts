import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Income } from 'src/app/interfaces/income';
import { Outcome } from 'src/app/interfaces/outcome';
import { ErrorService } from 'src/app/service/error.service';
import { IncomeService } from 'src/app/service/income.service';
import { OutcomeService } from 'src/app/service/outcome.service';

@Component({
  selector: 'app-accountings',
  templateUrl: './accountings.component.html',
  styleUrls: ['./accountings.component.css']
})
export class AccountingsComponent implements OnInit {
  loadingI= true;
  loadingO= true;
  incomeARS: Income[] = [];
  incomeUSD: Income[] = [];
  outcomeARS: Outcome[] = [];
  outcomeUSD: Outcome[] = [];

  constructor(
    private errorService: ErrorService,
    private toastr: ToastrService,
    private incomeService: IncomeService,
    private outcomeService: OutcomeService
  ) {}

  ngOnInit(): void {
    this.getIncomes() 
    this.getOutcome()     
  }

  getIncomes() {
    this.incomeService.getIncomes().subscribe({
      next: (data: Income[]) => {
       data.forEach(element => {
        if(element.currency === "ARS"){
          this.incomeARS.push(element)
        } else {
          this.incomeUSD.push(element)
        }
       });
        this.loadingI = false;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loadingI = false;
      },
    });
  }

  getOutcome() {
    this.outcomeService.getOutcomes().subscribe({
      next: (data: Outcome[]) => {
       data.forEach(element => {
        if(element.currency === "ARS"){
          this.outcomeARS.push(element)
        } else {
          this.outcomeUSD.push(element)
        }
       });
        this.loadingI = false;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loadingI = false;
      },
    });
  }

  deleteIncome(id:number) {

  }

  deleteOutcome(id:number) {

  }
}
