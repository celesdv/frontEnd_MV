import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Assistance } from 'src/app/interfaces/assistance';
import { Supplier } from 'src/app/interfaces/supplier';
import { AssistanceService } from 'src/app/service/assistance.service';
import { BudgetService } from 'src/app/service/budget.service';
import { ErrorService } from 'src/app/service/error.service';
import { SupplierService } from 'src/app/service/supplier.service';

@Component({
  selector: 'app-form-assistance',
  templateUrl: './form-assistance.component.html',
  styleUrls: ['./form-assistance.component.css'],
})
export class FormAssistanceComponent implements OnInit {
  loading: boolean = false;
  show: boolean = true;
  form: FormGroup;
  id: number = 0;
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
    private assistanceService: AssistanceService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      type: [''],
      value: [, [Validators.required]],
      tax: [],
      detail: [''],
      supplierId: [, [Validators.required]],
    });
    this.budgetId = budgetService.getId();
  }

  ngOnInit(): void {
    this.getSuppliers();
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

  editAssistance(id: number) {
    this.id = id;
    this.getAssistance(id);
    this.action = 'Editar ';
    this.show = false;
  }

  getAssistance(id: number) {
    this.assistanceService.getById(id).subscribe({
      next: (data: Assistance) => {
        this.form.setValue({
          name: data.name,
          type: data.type,
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
      const assistance: Assistance = {
        name: this.form.value.name,
        type: this.form.value.type,
        value: this.form.value.value,
        tax: this.form.value.tax,
        detail: this.form.value.detail,
        supplierId: this.form.value.supplierId,
        budgetId: this.budgetId,
      };

      if (this.id !== 0) {
        assistance.id = this.id;
        this.assistanceService.updateAssistance(assistance).subscribe({
          next: () => {
            this.toastr.success(
              `La asistencia ${assistance.name} fue editada con exito`,
              'Asistencia editada'
            );
            this.loading = false;
            this.show = true;
            this.form.reset();
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        });
      } else {
        this.assistanceService.addAssistance(assistance).subscribe({
          next: () => {
            this.toastr.success(
              `La asistencia ${assistance.name} fue registrada con exito`,
              'Asistencia agregada'
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
