import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BudgetService } from 'src/app/service/budget.service';
import { ErrorService } from 'src/app/service/error.service';

@Component({
  selector: 'app-form-hotel',
  templateUrl: './form-hotel.component.html',
  styleUrls: ['./form-hotel.component.css'],
})
export class FormHotelComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  id?: number;
  action: string = 'Agregar ';

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private errorService: ErrorService,
    private budgetService: BudgetService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      regime: [''],
      nights: [, [Validators.required]],
      rooms: [],
      rooms_type: [''],
      value: [, [Validators.required]],
      tax: [],
      detail: [''],
    });
    this.id = budgetService.getId();
  }

  ngOnInit(): void {
    console.log(this.id);
  }

  accept() {}
}
