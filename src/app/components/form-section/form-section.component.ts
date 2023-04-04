import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Section } from 'src/app/interfaces/section';

@Component({
  selector: 'app-form-section',
  templateUrl: './form-section.component.html',
  styleUrls: ['./form-section.component.css'],
})
export class FormSectionComponent implements OnInit {
 
  @Output() newSectionEvent = new EventEmitter<Section>();
  added: boolean = false;
  loading: boolean = false;
  form: FormGroup;
  section!:Section

  constructor(private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      name: ['', Validators.required],
      departure_hour: [null, Validators.required],
      departure_minute: [null, Validators.required],
      departure_day: [null, Validators.required],
      departure_month: [null, Validators.required],
      departure_year: [null, Validators.required],
      arrival_hour: [null, Validators.required],
      arrival_minute: [null, Validators.required],
      arrival_day: [null, Validators.required],
      arrival_month: [null, Validators.required],
      arrival_year: [null, Validators.required],
      company: [''],
      detail: [''],
    });
  }

  ngOnInit(): void {}

  accept() {
    let origin = new Date(
      this.form.value.departure_year,
      this.form.value.departure_month - 1,
      this.form.value.departure_day,
      this.form.value.departure_hour,
      this.form.value.departure_minute,
    ).toISOString();
    let destination = new Date(
      this.form.value.arrival_year,
      this.form.value.arrival_month - 1,
      this.form.value.arrival_day,
      this.form.value.arrival_hour,
      this.form.value.arrival_minute,
    ).toISOString();
    this.section = {
      name: this.form.value.name,
      company: this.form.value.company,
      calendar_origin: origin,
      calendar_destination: destination,
      detail: this.form.value.detail,
    };

    console.log(this.section)
    this.newSectionEvent.emit(this.section)
    this.added = true
  }
}
