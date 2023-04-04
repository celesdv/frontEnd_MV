import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Section } from 'src/app/interfaces/section';
import { Supplier } from 'src/app/interfaces/supplier';
import { BudgetService } from 'src/app/service/budget.service';
import { ErrorService } from 'src/app/service/error.service';
import { SupplierService } from 'src/app/service/supplier.service';

@Component({
  selector: 'app-form-flight',
  templateUrl: './form-flight.component.html',
  styleUrls: ['./form-flight.component.css'],
})
export class FormFlightComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  id?: number;
  action: string = 'Agregar ';
  suppliers: Supplier[] = [];
  sections: Section[] = [];
  newI: number[] = []

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private errorService: ErrorService,
    private budgetService: BudgetService,
    private supplierService: SupplierService,
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

  addSection() {
    this.newI.push(0)
  }

  addNewSection(section:Section) {
    this.sections.push(section)
    console.log(this.sections)
  }

  accept() {}
}
