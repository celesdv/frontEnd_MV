import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Flight } from 'src/app/interfaces/flight';
import { Section } from 'src/app/interfaces/section';
import { Supplier } from 'src/app/interfaces/supplier';
import { BudgetService } from 'src/app/service/budget.service';
import { ErrorService } from 'src/app/service/error.service';
import { FlightService } from 'src/app/service/flight.service';
import { SupplierService } from 'src/app/service/supplier.service';

@Component({
  selector: 'app-form-flight',
  templateUrl: './form-flight.component.html',
  styleUrls: ['./form-flight.component.css'],
})
export class FormFlightComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  budgetId: number;
  action: string = 'Agregar ';
  suppliers: Supplier[] = [];
  sections: Section[] = [];
  newI: number[] = [];
  id: number = 0;
  show: boolean = true

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private errorService: ErrorService,
    private budgetService: BudgetService,
    private supplierService: SupplierService,
    private flightService: FlightService
  ) {
    this.form = this.formBuilder.group({
      origin: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      date: [''],
      baggage: [''],
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

  addSection() {
    this.newI.push(0);
  }

  addNewSection(section: Section, index: number) {
    this.sections.splice(index, 1, section);
  }

  deleteI(index: number) {
    if (!this.sections[index]) {
      this.newI.splice(index, 1);
    }
  }

  deleteSection(index: number) {
    this.newI.splice(index, 1);
    this.sections.splice(index, 1);
  }

  editFlight(id: number) {
    this.id = id;
    this.getFlight(this.id);
    this.action = "Editar "
    this.show = false;
  }

  getFlight(id: number) {
    this.flightService.getById(id).subscribe({
      next: (data: Flight) => {
        this.sections = data.sections
        this.form.setValue({
          origin: data.origin,
          destination: data.destination,
          date: data.date,
          baggage: data.baggage,
          value: data.value,
          tax: data.tax,
          detail: data.detail,
          supplierId: data.supplierId,
        });
        data.sections.forEach(e => {
          this.newI.push(0);
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
      const fligth: Flight = {
        origin: this.form.value.origin,
        destination: this.form.value.destination,
        date: this.form.value.date,
        baggage: this.form.value.baggage,
        value: this.form.value.value,
        tax: this.form.value.tax,
        detail: this.form.value.detail,
        budgetId: this.budgetId,
        supplierId: this.form.value.supplierId,
        sections: this.sections,
      };

      if (this.id !== 0) {
        fligth.id = this.id;
        this.flightService.updateFlight(fligth).subscribe({
          next: () => {
            this.toastr.success(
              `El áereo ${fligth.origin} / ${fligth.destination} fue editado con exito`,
              'Áereo editado'
            );
            this.loading = false;
            this.newI = [];
            this.form.reset();
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        });
        this.show = true;
      } else {
        this.flightService.addFlight(fligth).subscribe({
          next: () => {
            this.toastr.success(
              `El áereo ${fligth.origin} / ${fligth.destination} fue registrado con exito`,
              'Áereo agregado'
            );
            this.loading = false;
            this.newI = [];
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
