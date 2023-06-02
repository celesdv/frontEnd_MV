import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Section } from 'src/app/interfaces/section';
import { ErrorService } from 'src/app/service/error.service';
import { SectionService } from 'src/app/service/section.service';

@Component({
  selector: 'app-form-section',
  templateUrl: './form-section.component.html',
  styleUrls: ['./form-section.component.css'],
})
export class FormSectionComponent implements OnInit {
  @Input() flightId!: number;
  @Input() index!: number;
  @Input() sec!: Section;
  @Output() newSectionEvent = new EventEmitter<Section>();
  @Output() closeSectionEvent = new EventEmitter<void>();
  @Output() deleteSectionEvent = new EventEmitter<number>();

  added: boolean = false;
  loading: boolean = false;
  form: FormGroup;
  section!: Section;
  action: string = 'Agregar ';

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private errorService: ErrorService,
    private sectionService: SectionService
  ) {
    this.form = formBuilder.group({
      name: ['', Validators.required],
      departure_hour: [null],
      departure_minute: [null],
      departure_day: [null],
      departure_month: [null],
      departure_year: [null],
      arrival_hour: [null],
      arrival_minute: [null],
      arrival_day: [null],
      arrival_month: [null],
      arrival_year: [null],
      company: [''],
      detail: [''],
    });
  }

  ngOnInit(): void {
    if (this.sec) {
      this.added = true;
      this.section = this.sec;
    }
  }

  edit() {
    this.added = false;
    this.form.setValue({
      name: this.section.name,
      departure_hour: this.section.calendar_origin.substring(11, 13),
      departure_minute: this.section.calendar_origin.substring(14, 16),
      departure_day: this.section.calendar_origin.substring(8, 10),
      departure_month: this.section.calendar_origin.substring(5, 7),
      departure_year: this.section.calendar_origin.substring(0, 4),
      arrival_hour: this.section.calendar_destination.substring(11, 13),
      arrival_minute: this.section.calendar_destination.substring(14, 16),
      arrival_day: this.section.calendar_destination.substring(8, 10),
      arrival_month: this.section.calendar_destination.substring(5, 7),
      arrival_year: this.section.calendar_destination.substring(0, 4),
      company: this.section.company,
      detail: this.section.detail,
    });
    this.action = 'Editar';
  }

  accept() {
    let origin = new Date(
      this.form.value.departure_year,
      this.form.value.departure_month - 1,
      this.form.value.departure_day,
      this.form.value.departure_hour - 3,
      this.form.value.departure_minute
    ).toISOString();
    let destination = new Date(
      this.form.value.arrival_year,
      this.form.value.arrival_month - 1,
      this.form.value.arrival_day,
      this.form.value.arrival_hour - 3,
      this.form.value.arrival_minute
    ).toISOString();
    this.section = {
      name: this.form.value.name,
      company: this.form.value.company,
      calendar_origin: origin,
      calendar_destination: destination,
      detail: this.form.value.detail,
    };

    if (this.sec) {
      this.section.id = this.sec.id;
      this.sectionService.updateSection(this.section).subscribe({
        next: () => {
          this.toastr.success(
            `El tramo ${this.section.name} fue editado con exito`,
            'Tramo editado'
          );
          this.loading = false;
          this.added = true;
          this.newSectionEvent.emit(this.section);
        },
        error: (e: HttpErrorResponse) => {
          this.errorService.msjError(e);
          this.loading = false;
        },
      });
    } else {
      if(this.flightId != 0) {
        this.section.flightId = this.flightId
        this.sectionService.addSection(this.section).subscribe({
          next: (data:Section) => {
            this.toastr.success(
              `El tramo ${data.name} fue agregado con exito`,
              'Tramo agregado'
            );
            this.loading = false;
            this.added = true;
            this.section = data
            this.newSectionEvent.emit(data);
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        });
      } else {
        this.newSectionEvent.emit(this.section);
        this.added = true;
      }
    }
  }

  close() {
    if(!this.sec) {
      this.closeSectionEvent.emit();
    }    
    this.added = true;
  }

  deleteSection(id: number) {
    console.log(id);
    if(id) {
      this.sectionService.deleteSection(id).subscribe({
        next: () => {
          this.toastr.info('Registro Eliminado', 'Exito');
          this.deleteSectionEvent.emit(id);
        },
        error: (e: HttpErrorResponse) => {
          this.errorService.msjError(e);
          this.loading = false;
        },
      });
    } else {
      this.deleteSectionEvent.emit(id)
    }
    
  }
}
