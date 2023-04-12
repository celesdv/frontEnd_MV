import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Excursion } from 'src/app/interfaces/excursion';
import { Supplier } from 'src/app/interfaces/supplier';
import { BudgetService } from 'src/app/service/budget.service';
import { ErrorService } from 'src/app/service/error.service';
import { ExcursionService } from 'src/app/service/excursion.service';
import { SupplierService } from 'src/app/service/supplier.service';

@Component({
  selector: 'app-form-excursion',
  templateUrl: './form-excursion.component.html',
  styleUrls: ['./form-excursion.component.css'],
})
export class FormExcursionComponent implements OnInit {
  loading: boolean = false;
  show: boolean = true;
  form: FormGroup;
  id = 0;
  action: string = 'Agregar ';
  suppliers: Supplier[] = [];
  budgetId: number;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private errorService: ErrorService,
    private budgetService: BudgetService,
    private supplierService: SupplierService,
    private excursionService: ExcursionService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      date: [''],
      value: [, [Validators.required]],
      tax: [],
      detail: [''],
      supplierId: [, [Validators.required]],
    });
    this.budgetId = budgetService.getId();
  }

  ngOnInit(): void {
    this.getSuppliers();
    console.log(this.id)
  }

  getSuppliers() {
    this.supplierService.getSuppliers().subscribe({
      next: (data: Supplier[]) => {
        this.suppliers = data;
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  editExcursion(id: number) {
    this.id = id;
    this.getExcursion(id);
    this.action = 'Editar ';
    this.show = false;
  }

  getExcursion(id: number) {
    this.excursionService.getById(id).subscribe({
      next: (data: Excursion) => {
        this.form.setValue({
          name: data.name,
          date: data.date,
          value: data.value,
          tax: data.tax,
          detail: data.detail,
          supplierId: data.supplierId,
        });
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  accept() {
    this.loading = true;
    if (this.form.valid) {
      const excursion: Excursion = {
        name: this.form.value.name,
        date: this.form.value.date,
        value: this.form.value.value,
        tax: this.form.value.tax,
        detail: this.form.value.detail,
        supplierId: this.form.value.supplierId,
        budgetId: this.budgetId,
      };

      if (this.id !== 0) {
        excursion.id = this.id;
        this.excursionService.updateExcursion(excursion).subscribe({
          next: () => {
            this.toastr.success(
              `La excursión ${excursion.name} fue editada con exito`,
              'Excursión editada'
            );
            this.loading = false;
            this.show = true;
            this.form.reset();
            this.id = 0
            this.action = 'Agregar ';
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        });
      } else {
        this.excursionService.addExcursion(excursion).subscribe({
          next: () => {
            this.toastr.success(
              `La excursión ${excursion.name} fue registrada con exito`,
              'Excursión agregada'
            );
            this.loading = false;
            this.form.reset();
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        });
      }
    }
  }
}
