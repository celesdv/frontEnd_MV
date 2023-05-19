import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Hotel } from 'src/app/interfaces/hotel';
import { ErrorService } from 'src/app/service/error.service';
import { HotelService } from 'src/app/service/hotel.service';

@Component({
  selector: 'app-form-hotel',
  templateUrl: './form-hotel.component.html',
  styleUrls: ['./form-hotel.component.css'],
})
export class FormHotelComponent implements OnInit {
  @Input() accommodationId!: number;
  @Input() index!: number;
  @Input() hot!: Hotel;
  @Output() newHotelEvent = new EventEmitter<Hotel>();
  @Output() closeHotelEvent = new EventEmitter<void>();
  @Output() deleteHotelEvent = new EventEmitter<number>();

  added: boolean = false;
  loading: boolean = false;
  form: FormGroup;
  action: string = 'Agregar ';
  hotel!: Hotel;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private errorService: ErrorService,
    private hotelService: HotelService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      regime: [''],
      nights: [, [Validators.required]],
      detail: [''],
    });
  }

  ngOnInit(): void {
    if (this.hot) {
      this.added = true;
      this.hotel = this.hot;
    }
  }

  edit() {
    this.added = false;
    this.form.setValue({
      name: this.hotel.name,
      regime: this.hotel.regime,
      nights: this.hotel.nights,
      detail: this.hotel.detail,
    });
    this.action = 'Editar';
  }

  accept() {
    this.hotel = {
      name: this.form.value.name,
      regime: this.form.value.regime,
      nights: this.form.value.nights,
      detail: this.form.value.detail,
    };

    if (this.hot) {
      this.hotel.id = this.hot.id;
      this.hotelService.updateHotel(this.hotel).subscribe({
        next: () => {
          this.toastr.success(
            `El hotel ${this.hotel.name} fue editado con exito`,
            'Hotel editado'
          );
          this.loading = false;
          this.added = true;
          this.newHotelEvent.emit(this.hotel);
        },
        error: (e: HttpErrorResponse) => {
          this.errorService.msjError(e);
          this.loading = false;
        },
      });
    } else {
      if (this.accommodationId != 0) {
        this.hotel.accommodationId = this.accommodationId;
        this.hotelService.addHotel(this.hotel).subscribe({
          next: (data:Hotel) => {
            this.toastr.success(
              `El tramo ${data.name} fue agregado con exito`,
              'Tramo agregado'
            );
            this.loading = false;
            this.added = true;
            this.hotel = data
            this.newHotelEvent.emit(data);
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        });
      } else {
        this.newHotelEvent.emit(this.hotel);
        this.added = true;
      }
    }
  }

  close() {
    if(!this.hot) {
      this.closeHotelEvent.emit()
    }     
    this.added = true
  }

  deleteHotel(id:number) {
    console.log(id)
    if(id) {
      this.hotelService.deleteHotel(id).subscribe({
        next: () => {
          this.toastr.info('Registro Eliminado', 'Exito');
          this.deleteHotelEvent.emit(id)
        },
        error: (e: HttpErrorResponse) => {
          this.errorService.msjError(e);
          this.loading = false;
        },
      });
    }  else {
      this.deleteHotelEvent.emit(id)
    }  
  } 
}
