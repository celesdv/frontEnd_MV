import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Count } from 'src/app/interfaces/count';
import { Income } from 'src/app/interfaces/income';
import { Outcome } from 'src/app/interfaces/outcome';
import { CountService } from 'src/app/service/count.service';
import { ErrorService } from 'src/app/service/error.service';
import { IncomeService } from 'src/app/service/income.service';
import { OutcomeService } from 'src/app/service/outcome.service';

@Component({
  selector: 'app-by-count',
  templateUrl: './by-count.component.html',
  styleUrls: ['./by-count.component.css'],
})
export class ByCountComponent implements OnInit {
  counts: Count[] = [];
  countId!: number;
  loading: boolean = false;
  countSelected!: Count;
  incomes: Income[] = [];
  outcomes: Outcome[] = [];
  total = 0;
  totalIncomes = 0;
  totalOutcomes = 0;
  datos: any[] = [];
  currency = 'ARS'

  constructor(
    private errorService: ErrorService,
    private countService: CountService,
    private incomeService: IncomeService,
    private outcomeService: OutcomeService
  ) {}

  ngOnInit(): void {
    this.getCounts();
  }

  getCounts() {
    this.countService.getCounts().subscribe({
      next: (data: Count[]) => {
        this.counts = data;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }

  onChange(e: any) {
    this.countId = e.value;
    this.total = 0;
    this.totalIncomes = 0;
    this.totalOutcomes = 0;
    this.incomes = [];
    this.outcomes = [];
    this.currency = 'ARS'
    this.datos = [];
    if (this.countId) {
      this.loading = true;
      this.getCount(this.countId);
    }
  }

  getCount(id: number) {
    this.countService.getById(id).subscribe({
      next: (data: Count) => {
        this.countSelected = data;
        console.log(this.countSelected);
        this.getIncomesByCount(id);
        if(this.countSelected.name.includes('USD')) this.currency = 'USD'
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }

  getIncomesByCount(id: number) {
    this.incomeService.getByCount(id).subscribe({
      next: (data: Income[]) => {
        this.incomes = data.reverse();
        this.incomes.forEach((element) => {
          if (this.currency === 'ARS') {
            this.datos.push(element);
            this.totalIncomes = this.totalIncomes + element.total;
          } else {
            this.datos.push(element);
            this.totalIncomes = this.totalIncomes + element.total_usd;
          }
        });
        this.getOutcomesByCount(id);
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }

  getOutcomesByCount(id: number) {
    this.outcomeService.getByCount(id).subscribe({
      next: (data: Outcome[]) => {
        this.outcomes = data.reverse();
        this.outcomes.forEach((element) => {
          if (this.currency === 'ARS') {
            this.totalOutcomes = this.totalOutcomes + element.total;
            element.total = -element.total;
            this.datos.push(element);
          } else {
            this.totalOutcomes = this.totalOutcomes + element.total_usd;
            element.total_usd = -element.total_usd;
            this.datos.push(element);
          }
        });
        this.total = this.totalIncomes - this.totalOutcomes;
        this.datos = this.datos
          .sort((a, b) => moment(a.date).unix() - moment(b.date).unix())
          .reverse();
        console.log(this.datos);
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
    });
  }
}
