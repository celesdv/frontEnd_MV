import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Supplier } from 'src/app/interfaces/supplier';
import { Transfer } from 'src/app/interfaces/transfer';
import { BudgetService } from 'src/app/service/budget.service';
import { ErrorService } from 'src/app/service/error.service';
import { SupplierService } from 'src/app/service/supplier.service';
import { TransferService } from 'src/app/service/transfer.service';

@Component({
  selector: 'app-form-transfer',
  templateUrl: './form-transfer.component.html',
  styleUrls: ['./form-transfer.component.css'],
})
export class FormTransferComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  budgetId: number;
  id:number = 0
  action: string = 'Agregar ';
  show: boolean = true;
  suppliers: Supplier[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private errorService: ErrorService,
    private budgetService: BudgetService,
    private supplierService: SupplierService,
    private transferService: TransferService
  ) {
    this.form = this.formBuilder.group({
      origin: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      type: [''],
      conveyance: [''],
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

  editTransfer(id: number) {
    this.id = id;
    this.getTransfer(id);
    this.action = 'Editar ';
    this.show = false;
  }

  getTransfer(id: number) {
    this.transferService.getById(id).subscribe({
      next: (data: Transfer) => {
        this.form.setValue({
          origin: data.origin,
          destination: data.destination,
          type: data.type,
          conveyance: data.conveyance,
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
      const transfer: Transfer = {
        origin: this.form.value.origin,
        destination: this.form.value.destination,
        type: this.form.value.type,
        conveyance: this.form.value.conveyance,
        value: this.form.value.value,
        tax: this.form.value.tax,
        detail: this.form.value.detail,
        supplierId: this.form.value.supplierId,
        budgetId: this.budgetId,
      };

      if (this.id !== 0) {
        transfer.id = this.id
        this.transferService.updateTransfer(transfer).subscribe({
          next: () => {
            this.toastr.success(
              `El traslado ${transfer.origin} - ${transfer.destination} fue editado con exito`,
              'Traslado editado'
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
        })
      } else {
        this.transferService.addTransfer(transfer).subscribe({
          next: () => {
            this.toastr.success(
              `El traslado ${transfer.origin} - ${transfer.destination} fue registrado con exito`,
              'Traslado agregado'
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
