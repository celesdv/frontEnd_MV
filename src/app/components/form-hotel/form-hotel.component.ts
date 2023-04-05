import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hotel } from 'src/app/interfaces/hotel';

@Component({
  selector: 'app-form-hotel',
  templateUrl: './form-hotel.component.html',
  styleUrls: ['./form-hotel.component.css'],
})
export class FormHotelComponent implements OnInit {
  @Input() index!: number;
  @Output() newHotelEvent = new EventEmitter<Hotel>();
  added: boolean = false;
  loading: boolean = false;
  form: FormGroup;
  action: string = 'Agregar ';
  hotel!: Hotel;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      regime: [''],
      nights: [, [Validators.required]],
      detail: [''],
    });
  }

  ngOnInit(): void {}

  edit() {
    this.added = false;
    this.form.setValue({
      name: this.hotel.name,
      regime: this.hotel.regime,
      nights: this.hotel.nights,
      detail: this.hotel.detail,
    })
    this.action = 'Editar'
  }

  accept() {
    this.hotel = {
      name: this.form.value.name,
      regime: this.form.value.regime,
      nights: this.form.value.nights,
      detail: this.form.value.detail,
    };
    this.newHotelEvent.emit(this.hotel);
    this.added = true;
  }
}
