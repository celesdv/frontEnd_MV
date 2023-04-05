import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Extra } from 'src/app/interfaces/extras';

@Component({
  selector: 'app-form-extra',
  templateUrl: './form-extra.component.html',
  styleUrls: ['./form-extra.component.css']
})
export class FormExtraComponent implements OnInit {
  @Input() index!: number;
  @Output() newExtraEvent = new EventEmitter<Extra>();
  added: boolean = false;
  loading: boolean = false;
  form: FormGroup;
  action: string = 'Agregar ';
  extra!: Extra;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      detail: [''],
    });
  }

  ngOnInit(): void {}

  edit() {
    this.added = false;
    this.form.setValue({
      name: this.extra.name,
      detail: this.extra.detail,
    })
    this.action = 'Editar'
  }

  accept() {
    this.extra = {
      name: this.form.value.name,
      detail: this.form.value.detail,
    };
    this.newExtraEvent.emit(this.extra);
    this.added = true;
  }
}
