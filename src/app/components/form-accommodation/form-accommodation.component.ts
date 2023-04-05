import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Extra } from 'src/app/interfaces/extras';
import { Hotel } from 'src/app/interfaces/hotel';
import { Supplier } from 'src/app/interfaces/supplier';
import { BudgetService } from 'src/app/service/budget.service';
import { ErrorService } from 'src/app/service/error.service';
import { SupplierService } from 'src/app/service/supplier.service';

@Component({
  selector: 'app-form-accommodation',
  templateUrl: './form-accommodation.component.html',
  styleUrls: ['./form-accommodation.component.css'],
})
export class FormAccommodationComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  id?: number;
  action: string = 'Agregar ';
  suppliers: Supplier[] = [];
  newH: number[] = [];
  newE: number[] = [];
  hotels: Hotel[] = [];
  extras: Extra[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private errorService: ErrorService,
    private budgetService: BudgetService,
    private supplierService: SupplierService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      nights: [, [Validators.required]],
      value: [, [Validators.required]],
      tax: [],
      detail: [''],
      supplierId: [, Validators.required],
    });
    this.id = budgetService.getId();
  }

  ngOnInit(): void {
    this.getSuppliers();
    console.log(this.id);
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

  addHotel() {
    this.newH.push(0);
  }

  addNewHotel(hotel: Hotel, index: number) {
    this.hotels.splice(index, 1, hotel);
  }

  addExtra() {
    this.newE.push(0);
  }

  addNewExtra(extra: Extra, index: number) {
    this.extras.splice(index, 1, extra);
  }

  accept() {}
}
