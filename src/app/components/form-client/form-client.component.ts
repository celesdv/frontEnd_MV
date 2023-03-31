import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Client } from 'src/app/interfaces/client';
import { ClientService } from 'src/app/service/client.service';
import { ErrorService } from 'src/app/service/error.service';

@Component({
  selector: 'app-form-client',
  templateUrl: './form-client.component.html',
  styleUrls: ['./form-client.component.css'],
})
export class FormClientComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  id: number;
  action: string = 'Agregar ';

  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private toastr: ToastrService,
    private router: Router,
    private errorService: ErrorService,
    private aRoute: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', Validators.email],
      address: [],
      phone: [],
      cuil: [],
    });
    this.id = Number(aRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (this.id != 0) {
      this.action = 'Editar ';
      this.getClient(this.id);
    }
  }

  getClient(id: number) {
    this.loading = true;
    this.clientService.getById(id).subscribe({
      next: (data: Client) => {
        this.loading = false;
        this.form.setValue({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          address: data.address,
          phone: data.phone,
          cuil: data.cuil,
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
      const client: Client = {
        first_name: this.form.value.first_name,
        last_name: this.form.value.last_name,
        email: this.form.value.email,
        address: this.form.value.address,
        phone: this.form.value.phone,
        cuil: this.form.value.cuil,
      };

      if (this.id !== 0) {
        client.id = this.id
        this.clientService.updateClient(client).subscribe({
          next: () => {
            this.toastr.success(
              `El cliente ${client.first_name} ${client.last_name} fue editado con exito`,
              'Cliente editado'
            );
            this.loading = false;
            this.router.navigate(['/clients']);
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        })
      } else {
        this.clientService.addClient(client).subscribe({
          next: () => {
            this.toastr.success(
              `El cliente ${client.first_name} ${client.last_name} fue registrado con exito`,
              'Cliente agregado'
            );
            this.loading = false;
            this.router.navigate(['/clients']);
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
