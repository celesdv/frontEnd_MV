import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Count } from 'src/app/interfaces/count';
import { CountService } from 'src/app/service/count.service';
import { ErrorService } from 'src/app/service/error.service';

@Component({
  selector: 'app-counts',
  templateUrl: './counts.component.html',
  styleUrls: ['./counts.component.css'],
})
export class CountsComponent implements OnInit {
  loading = true;
  counts: Count[] = [];

  constructor(
    private errorService: ErrorService,
    private toastr: ToastrService,
    private countService: CountService
  ) {}

  ngOnInit(): void {
    this.getCounts();
  }

  getCounts() {
    this.countService.getCounts().subscribe({
      next: (data: Count[]) => {
        this.counts = data;
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  deleteCount(id: number) {
    this.loading = true;
    this.countService.deleteCount(id).subscribe({
      next: () => {
        this.toastr.info('Registro Eliminado', 'Exito');
        this.getCounts();
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }
}
