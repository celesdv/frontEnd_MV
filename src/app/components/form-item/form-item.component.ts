import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Item } from 'src/app/interfaces/item';
import { Supplier } from 'src/app/interfaces/supplier';
import { BudgetService } from 'src/app/service/budget.service';
import { ErrorService } from 'src/app/service/error.service';
import { ItemService } from 'src/app/service/item.service';
import { SupplierService } from 'src/app/service/supplier.service';

@Component({
  selector: 'app-form-item',
  templateUrl: './form-item.component.html',
  styleUrls: ['./form-item.component.css']
})
export class FormItemComponent implements OnInit {
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
    private itemService: ItemService
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

  editItem(id: number) {
    this.id = id;
    this.getItem(id);
    this.action = 'Editar ';
    this.show = false;
  }

  getItem(id: number) {
    this.itemService.getById(id).subscribe({
      next: (data: Item) => {
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
      const item: Item = {
        name: this.form.value.name,
        type: this.form.value.type,
        value: this.form.value.value,
        tax: this.form.value.tax,
        detail: this.form.value.detail,
        supplierId: this.form.value.supplierId,
        budgetId: this.budgetId,
      };

      if (this.id !== 0) {
        item.id = this.id;
        this.itemService.updateItem(item).subscribe({
          next: () => {
            this.toastr.success(
              `El item extra ${item.name} fue editado con exito`,
              'Item editado'
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
        this.itemService.addItem(item).subscribe({
          next: () => {
            this.toastr.success(
              `El item extra ${item.name} fue registrado con exito`,
              'Item agregado'
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
