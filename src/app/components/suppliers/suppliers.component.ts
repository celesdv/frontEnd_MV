import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Supplier } from 'src/app/interfaces/supplier';
import { ErrorService } from 'src/app/service/error.service';
import { SupplierService } from 'src/app/service/supplier.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {
  loading = true;
  suppliers: Supplier[] = [];

  constructor(
    private errorService: ErrorService,
    private toastr: ToastrService,
    private supplierService: SupplierService
  ) {}

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

  deleteSupplier(id: number){
    this.loading = true;
    this.supplierService.deleteSupplier(id).subscribe({
      next: () => {
        this.toastr.info('Registro Eliminado', 'Exito');
        this.getSuppliers();
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }
}
