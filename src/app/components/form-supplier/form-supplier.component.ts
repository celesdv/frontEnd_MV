import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Supplier } from 'src/app/interfaces/supplier';
import { ErrorService } from 'src/app/service/error.service';
import { SupplierService } from 'src/app/service/supplier.service';

@Component({
  selector: 'app-form-supplier',
  templateUrl: './form-supplier.component.html',
  styleUrls: ['./form-supplier.component.css']
})
export class FormSupplierComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  id: number;
  action: string = 'Agregar ';

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private errorService: ErrorService,
    private aRoute: ActivatedRoute,
    private supplierService: SupplierService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cbu: ['', [Validators.pattern("^[0-9]*$")]],
      phone: [''],
    });
    this.id = Number(aRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (this.id != 0) {
      this.action = 'Editar ';
      this.getSupplier(this.id);
    }
  }

  getSupplier(id:number){
    this.loading = true;
    this.supplierService.getById(id).subscribe({
      next: (data: Supplier) => {
        this.loading = false;
        this.form.setValue({
          name: data.name,
          email: data.email,
          cbu: data.cbu,
          phone: data.phone,
        });
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    })
  }

  accept() {
    this.loading = true;
    if (this.form.valid) {
      const supplier: Supplier = {
        name: this.form.value.name,
        email: this.form.value.email,
        cbu: this.form.value.cbu,
        phone: this.form.value.phone
      };

      if (this.id !== 0) {
        supplier.id = this.id
        this.supplierService.updateSupplier(supplier).subscribe({
          next: () => {
            this.toastr.success(
              `El proveedor ${supplier.name} fue editado con exito`,
              'Proveedor editado'
            );
            this.loading = false;
            this.router.navigate(['/suppliers']);
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        })
      } else {
        this.supplierService.addSupplier(supplier).subscribe({
          next: () => {
            this.toastr.success(
              `El proveedor ${supplier.name} fue editado con exito`,
              'Proveedor agregado'
            );
            this.loading = false;
            this.router.navigate(['/suppliers']);
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
