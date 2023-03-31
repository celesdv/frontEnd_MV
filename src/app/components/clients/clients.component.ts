import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Client } from 'src/app/interfaces/client';
import { ClientService } from 'src/app/service/client.service';
import { ErrorService } from 'src/app/service/error.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent implements OnInit {
  loading = true;
  clients: Client[] = [];

  constructor(
    private clientService: ClientService,
    private errorService: ErrorService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getClients();
  }

  getClients() {
    this.clientService.getClients().subscribe({
      next: (data: Client[]) => {
        this.clients = data;
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  deleteClient(id: number) {
    this.loading = true;
    this.clientService.deleteClient(id).subscribe({
      next: () => {
        this.toastr.info('Registro Eliminado', 'Exito');
        this.getClients();
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }
}
