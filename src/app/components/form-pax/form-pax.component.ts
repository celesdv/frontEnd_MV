import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Pax } from 'src/app/interfaces/pax';
import { ErrorService } from 'src/app/service/error.service';
import { PaxService } from 'src/app/service/pax.service';

@Component({
  selector: 'app-form-pax',
  templateUrl: './form-pax.component.html',
  styleUrls: ['./form-pax.component.css'],
})
export class FormPaxComponent implements OnInit {
  @Input() bookingId!: number;
  @Input() index!: number;
  @Input() pax!: Pax;
  @Output() newPaxEvent = new EventEmitter<Pax>();
  @Output() closePaxEvent = new EventEmitter<void>();
  @Output() deletePaxEvent = new EventEmitter<number>();

  added: boolean = false;
  loading: boolean = false;
  form: FormGroup;
  newPax!: Pax;
  action: string = 'Agregar ';

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private errorService: ErrorService,
    private paxServices: PaxService
  ) {
    this.form = formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      dni: ['', Validators.required],
      birth_date: [],
      passport: [],
      expiration: [],
    });
  }

  ngOnInit(): void {
    if (this.pax) {
      this.added = true;
      this.newPax = this.pax;
    }
  }

  edit() {
    this.added = false;
    let date = this.pax.birth_date?.substring(0, 10);
    let date2;
    if (this.pax.expiration) {
      let date2 = this.pax.expiration?.substring(0, 10);
    }
    this.form.setValue({
      first_name: this.pax.first_name,
      last_name: this.pax.last_name,
      dni: this.pax.dni,
      birth_date: date,
      passport: this.pax.passport,
      expiration: date2 ? date2 : null,
    });
    this.action = 'Editar';
  }

  accept() {
    this.newPax = {
      first_name: this.form.value.first_name,
      last_name: this.form.value.last_name,
      dni: this.form.value.dni,
      birth_date: this.form.value.birth_date + ' 00:00:00',
      passport: this.form.value.passport,
      expiration: this.form.value.expiration + ' 00:00:00',
    };
    if (this.pax) {
      this.newPax.id = this.pax.id;
      this.paxServices.updatePax(this.newPax).subscribe({
        next: () => {
          this.toastr.success(
            `El pasajero ${this.newPax.first_name} ${this.newPax.last_name} fue editado con exito`,
            'Pasajero editado'
          );
          this.loading = false;
          this.added = true;
          this.newPaxEvent.emit(this.newPax);
        },
        error: (e: HttpErrorResponse) => {
          this.errorService.msjError(e);
          this.loading = false;
        },
      });
    } else {
      if (this.bookingId != 0) {
        this.newPax.bookingId = this.bookingId;
        this.paxServices.addPax(this.newPax).subscribe({
          next: (data: Pax) => {
            this.toastr.success(
              `El pasajero ${this.newPax.first_name} ${this.newPax.last_name} fue agregado con exito`,
              'Pasajero agregado'
            );
            this.loading = false;
            this.added = true;
            this.newPax = data;
            this.newPaxEvent.emit(data);
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        });
      } else {
        this.newPaxEvent.emit(this.newPax);
        console.log(this.newPax);
        this.added = true;
      }
    }
  }

  close() {
    if (!this.pax) {
      this.closePaxEvent.emit();
    }
    this.added = true;
  }

  deletePax(id: number) {
    console.log(this.index)
    if (id) {
      this.paxServices.deletePax(id).subscribe({
        next: () => {
          this.toastr.info('Registro Eliminado', 'Exito');
          this.deletePaxEvent.emit(id);
        },
        error: (e: HttpErrorResponse) => {
          this.errorService.msjError(e);
          this.loading = false;
        },
      });
    } else {
      this.deletePaxEvent.emit(id);
    }
  }
}
