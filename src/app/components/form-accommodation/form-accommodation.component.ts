import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Accommodation } from 'src/app/interfaces/accommodation';
import { Extra } from 'src/app/interfaces/extras';
import { Hotel } from 'src/app/interfaces/hotel';
import { Supplier } from 'src/app/interfaces/supplier';
import { AccommodationService } from 'src/app/service/accommodation.service';
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
  budgetId: number;
  action: string = 'Agregar ';
  suppliers: Supplier[] = [];
  hotels: Hotel[] = [];
  newH: number[] = [];
  extras: Extra[] = [];
  newE: number[] = [];
  id: number = 0;
  show: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private errorService: ErrorService,
    private budgetService: BudgetService,
    private supplierService: SupplierService,
    private accommodationService: AccommodationService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      nights: [, [Validators.required]],
      value: [, [Validators.required]],
      tax: [],
      detail: [''],
      supplierId: [, Validators.required],
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

  addHotel() {
    this.newH.push(0);
  }

  addNewHotel(hotel: Hotel, index: number) {
    this.hotels.splice(index, 1, hotel);
  }

  deleteH(index: number) {
    if (!this.hotels[index]) {
      this.newH.splice(index, 1);
    }
  }

  deleteHotel(index: number) {
    this.newH.splice(index, 1);
    this.hotels.splice(index, 1);
  }

  addExtra() {
    this.newE.push(0);
  }

  addNewExtra(extra: Extra, index: number) {
    this.extras.splice(index, 1, extra);
  }

  deleteE(index: number) {
    if (!this.extras[index]) {
      this.newE.splice(index, 1);
    }
  }

  deleteExtra(index: number) {
    this.newE.splice(index, 1);
    this.extras.splice(index, 1);
  }

  editAccommodation(id: number) {
    this.id = id;
    this.getAccomodation(this.id);
    this.action = 'Editar ';
    this.show = false;
  }

  getAccomodation(id: number) {
    this.accommodationService.getById(id).subscribe({
      next: (data: Accommodation) => {
        this.form.setValue({
          name: data.name,
          nights: data.nights,
          value: data.value,
          tax: data.tax,
          detail: data.detail,
          supplierId: data.supplierId,
        });
        console.log(data.hotels);
        data.hotels.forEach((e) => {
          if (!e.soft_delete) {
            this.hotels.push(e);
            this.newH.push(0);
          }
        });
        data.extras.forEach((e) => {
          if(!e.soft_delete) {
            this.extras.push(e)
            this.newE.push(0);
          }          
        });
        this.loading = false;
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
      const accommodation: Accommodation = {
        name: this.form.value.name,
        nights: this.form.value.nights,
        value: this.form.value.value,
        tax: this.form.value.tax,
        detail: this.form.value.detail,
        budgetId: this.budgetId,
        supplierId: this.form.value.supplierId,
        extras: this.extras,
        hotels: this.hotels,
      };

      if (this.id !== 0) {
        accommodation.id = this.id;
        this.accommodationService.updateAccommodation(accommodation).subscribe({
          next: () => {
            this.toastr.success(
              `El alojamiento ${accommodation.name} fue editado con exito`,
              'Alojamiento editado'
            );
            this.loading = false;
            this.newE = [];
            this.newH = [];
            this.form.reset();
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        });
        this.show = true;
      } else {
        this.accommodationService.addAccommodation(accommodation).subscribe({
          next: () => {
            this.toastr.success(
              `El alojamiento ${accommodation.name} fue registrado con exito`,
              'Alojamiento agregado'
            );
            this.loading = false;
            this.newE = [];
            this.newH = [];
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
