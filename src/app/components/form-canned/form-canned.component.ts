import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Canned } from 'src/app/interfaces/canned';
import { Supplier } from 'src/app/interfaces/supplier';
import { BudgetService } from 'src/app/service/budget.service';
import { CannedService } from 'src/app/service/canned.service';
import { ErrorService } from 'src/app/service/error.service';
import { SupplierService } from 'src/app/service/supplier.service';

@Component({
  selector: 'app-form-canned',
  templateUrl: './form-canned.component.html',
  styleUrls: ['./form-canned.component.css']
})
export class FormCannedComponent implements OnInit {
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
    private errorService: ErrorService,
    private budgetService: BudgetService,
    private supplierService: SupplierService,
    private cannedService: CannedService
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

  editCanned(id: number) {
    this.id = id;
    this.getCanned(id);
    this.action = 'Editar ';
    this.show = false;
  }

  getCanned(id: number) {
    this.cannedService.getById(id).subscribe({
      next: (data: Canned) => {
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
      const canned: Canned = {
        name: this.form.value.name,
        type: this.form.value.type,
        value: this.form.value.value,
        tax: this.form.value.tax,
        detail: this.form.value.detail,
        supplierId: this.form.value.supplierId,
        budgetId: this.budgetId,
      };

      if (this.id !== 0) {
        canned.id = this.id;
        this.cannedService.updateCanned(canned).subscribe({
          next: () => {
            this.toastr.success(
              `El paquete enlatado ${canned.name} fue editado con exito`,
              'Paquete enlatado editado'
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
        this.cannedService.addCanned(canned).subscribe({
          next: () => {
            this.toastr.success(
              `El paquete enlatado ${canned.name} fue registrado con exito`,
              'Paquete enlatado agregado'
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
