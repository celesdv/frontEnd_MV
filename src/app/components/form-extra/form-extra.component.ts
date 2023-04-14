import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Extra } from 'src/app/interfaces/extras';
import { ErrorService } from 'src/app/service/error.service';
import { ExtraService } from 'src/app/service/extra.service';

@Component({
  selector: 'app-form-extra',
  templateUrl: './form-extra.component.html',
  styleUrls: ['./form-extra.component.css'],
})
export class FormExtraComponent implements OnInit {
  @Input() accommodationId!: number;
  @Input() index!: number;
  @Input() ext!: Extra;
  @Output() newExtraEvent = new EventEmitter<Extra>();
  @Output() closeExtraEvent = new EventEmitter<void>();
  @Output() deleteExtraEvent = new EventEmitter<void>();

  added: boolean = false;
  loading: boolean = false;
  form: FormGroup;
  action: string = 'Agregar ';
  extra!: Extra;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private errorService: ErrorService,
    private extraService: ExtraService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      detail: [''],
    });
  }

  ngOnInit(): void {
    if (this.ext) {
      this.added = true;
      this.extra = this.ext;
    }
  }

  edit() {
    this.added = false;
    this.form.setValue({
      name: this.extra.name,
      detail: this.extra.detail,
    });
    this.action = 'Editar';
  }

  accept() {
    this.extra = {
      name: this.form.value.name,
      detail: this.form.value.detail,
    };
    if (this.ext) {
      this.extra.id = this.ext.id;
      this.extraService.updateExtra(this.extra).subscribe({
        next: () => {
          this.toastr.success(
            `El extra ${this.extra.name} fue editado con exito`,
            'Extra editado'
          );
          this.loading = false;
          this.added = true;
          this.newExtraEvent.emit(this.extra);
        },
        error: (e: HttpErrorResponse) => {
          this.errorService.msjError(e);
          this.loading = false;
        },
      });
    } else {
      if (this.accommodationId != 0) {
        this.extra.accommodationId = this.accommodationId;
        this.extraService.addExtra(this.extra).subscribe({
          next: (data: Extra) => {
            this.toastr.success(
              `El extra ${data.name} fue agregado con exito`,
              'Extra agregado'
            );
            this.loading = false;
            this.added = true;
            this.extra = data;
            this.newExtraEvent.emit(data);
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        });
      } else {
        this.newExtraEvent.emit(this.extra);
        this.added = true;
      }
    }
  }

  close() {
    this.closeExtraEvent.emit();
    this.added = true;
  }

  deleteExtra(id: number) {
    console.log(id);
    this.extraService.deleteExtra(id).subscribe({
      next: () => {
        this.toastr.info('Registro Eliminado', 'Exito');
        this.deleteExtraEvent.emit();
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }
}
