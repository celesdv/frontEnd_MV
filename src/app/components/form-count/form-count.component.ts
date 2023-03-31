import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Count } from 'src/app/interfaces/count';
import { CountService } from 'src/app/service/count.service';
import { ErrorService } from 'src/app/service/error.service';

@Component({
  selector: 'app-form-count',
  templateUrl: './form-count.component.html',
  styleUrls: ['./form-count.component.css'],
})
export class FormCountComponent implements OnInit {
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
    private countService: CountService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      alias: [''],
      cbu: ['', [Validators.pattern("^[0-9]*$")]],
      detail: [''],
    });
    this.id = Number(aRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (this.id != 0) {
      this.action = 'Editar ';
      this.getCount(this.id);
    }
  }

  getCount(id:number){
    this.loading = true;
    this.countService.getById(id).subscribe({
      next: (data: Count) => {
        this.loading = false;
        this.form.setValue({
          name: data.name,
          alias: data.alias,
          cbu: data.cbu,
          detail: data.detail,
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
      const count: Count = {
        name: this.form.value.name,
        alias: this.form.value.alias,
        cbu: this.form.value.cbu,
        detail: this.form.value.detail
      };

      if (this.id !== 0) {
        count.id = this.id
        this.countService.updateCount(count).subscribe({
          next: () => {
            this.toastr.success(
              `La cuenta ${count.name} fue editada con exito`,
              'Cuenta editada'
            );
            this.loading = false;
            this.router.navigate(['/counts']);
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        })
      } else {
        this.countService.addCount(count).subscribe({
          next: () => {
            this.toastr.success(
              `La cuenta ${count.name} fue agregada con exito`,
              'Cuenta agregada'
            );
            this.loading = false;
            this.router.navigate(['/counts']);
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
