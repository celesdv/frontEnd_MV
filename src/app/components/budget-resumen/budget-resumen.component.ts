import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Budget } from 'src/app/interfaces/budget';
import { BudgetService } from 'src/app/service/budget.service';
import { ErrorService } from 'src/app/service/error.service';
import { jsPDF } from 'jspdf';
import { Section } from 'src/app/interfaces/section';
import { Flight } from 'src/app/interfaces/flight';
import { Accommodation } from 'src/app/interfaces/accommodation';
import { Transfer } from 'src/app/interfaces/transfer';
import { Excursion } from 'src/app/interfaces/excursion';
import { Assistance } from 'src/app/interfaces/assistance';
import { Canned } from 'src/app/interfaces/canned';
import { Hotel } from 'src/app/interfaces/hotel';
import { Extra } from 'src/app/interfaces/extras';
import { ActivatedRoute } from '@angular/router';
import { Item } from 'src/app/interfaces/item';
import { FooterService } from 'src/app/service/footer.service';
import { Organization } from 'src/app/interfaces/organization';

@Component({
  selector: 'app-budget-resumen',
  templateUrl: './budget-resumen.component.html',
  styleUrls: ['./budget-resumen.component.css'],
})
export class BudgetResumenComponent implements OnInit {
  loading: boolean = false;
  budget?: Budget;
  id: number;
  organization?: Organization;

  constructor(
    private budgetService: BudgetService,
    private errorService: ErrorService,
    private aRoute: ActivatedRoute,
    private organizationService: FooterService
  ) {
    this.id = Number(aRoute.snapshot.paramMap.get('id'));
    console.log(this.id);
  }

  ngOnInit(): void {
    this.getBudget(this.id);
    this.getOrganization();
  }

  getOrganization() {
    this.organizationService.getData().subscribe({
      next: (data: Organization) => {
        this.organization = data;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  getBudget(id: number) {
    this.loading = true;
    this.budgetService.getById(id).subscribe({
      next: (data: any) => {
        this.loading = false;
        this.budget = data;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  formatFecha(date: String) {
    let formatDate = '';
    let date1 = date.substring(0, 10).split('-').reverse().join('/');
    let date2 = date.substring(11, 16).concat(' hs');
    formatDate = `${date1} - ${date2}`;
    return formatDate;
  }

  exportPDF() {
    if (this.budget) {
      const doc = new jsPDF('p', 'mm', 'a4');
      let img = new Image();
      img.src = '../../../assets/img/cabecera.jpg';

      let i = 0;
      function setI(j: number) {
        if (i < 280) {
          i += j;
        } else {
          doc.addPage('a4');
          i = 5;
          doc.addImage(img, 'jpg', 5, i, 200, 30);
          setI(35);
        }
      }

      setI(5);
      doc.addImage(img, 'jpg', 5, i, 200, 30);

      if(this.organization) {
        doc.setFontSize(10);  
        doc.setTextColor(80, 108, 96);      
        doc.text(`Tel: ${this.organization.phone_number}`, 7, 26);
        doc.text(`Email: ${this.organization.email}`, 7, 30);
        doc.text(this.organization.address, 7, 34);
      }     

      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 53, 142);

      setI(32);
      doc.line(5, i, 205, i);
      doc.setFontSize(16);
      doc.setTextColor(0, 53, 142);
      setI(7);
      doc.text(`Presupuesto ${this.budget.order?.destination}`, doc.internal.pageSize.getWidth() / 2, i, {
        align: 'center',
      });
      setI(3);
      doc.line(5, i, 205, i);

      doc.setFontSize(14);
      doc.setTextColor(208, 38, 44);
      setI(10);
      doc.text('Detalle Pedido', 20, i);

      doc.setFontSize(10);
      doc.setTextColor(0);
      setI(7);
      doc.text('Nombre: ' + this.budget.order?.name, 30, i);
      setI(5);
      doc.text('Destino: ' + this.budget.order?.destination, 30, i);
      setI(5);
      doc.text('Fecha: ' + this.budget.order?.date, 30, i);
      setI(5);
      doc.text('Noches: ' + this.budget.order?.nights, 30, i);
      setI(5);
      doc.text('Pax: ', 30, i);

      if (this.budget.order?.adult) {
        setI(5);
        doc.text('• ' + this.budget.order?.adult + ' adultos', 40, i);
      }
      if (this.budget.order?.toddler) {
        setI(5);
        doc.text('• ' + this.budget.order?.toddler + ' bebes', 40, i);
      }
      if (this.budget.order?.child) {
        setI(5);
        doc.text('• ' + this.budget.order?.child + 'niños', 40, i);
      }
      if (this.budget.order?.teen) {
        setI(5);
        doc.text('• ' + this.budget.order?.teen + ' adolescentes', 40, i);
      }
      if (this.budget.order?.senior) {
        setI(5);
        doc.text('• ' + this.budget.order?.senior + ' adultos mayores', 40, i);
      }
      if (this.budget.order?.detail) {
        setI(5);
        doc.text('Detalle: ' + this.budget.order?.detail, 30, i);
      }

      setI(10);
      doc.setFontSize(14);
      doc.setTextColor(208, 38, 44);
      doc.text('Detalle Presupuesto', 20, i);

      doc.setLineWidth(0.05);
      doc.setDrawColor(93, 118, 103);
      doc.setTextColor(0);
      doc.setFontSize(12);

      if (this.budget.flights && this.budget.flights?.length > 0) {
        setI(10);
        doc.text('Servicios áereos: ', 30, i);
        doc.setFontSize(10);
        this.budget.flights.forEach((f: Flight) => {
          if (!f.soft_delete) {
            setI(10);
            doc.text(f.origin + ' - ' + f.destination, 40, i);
            setI(5);
            doc.text('Fecha: ' + f.baggage, 40, i);
            if (f.baggage) {
              setI(5);
              doc.text('Equipaje: ' + f.baggage, 40, i);
              setI(3);
            }
            if (f.sections && f.sections.length > 0) {
              setI(5);
              doc.text('Tramos: ', 40, i);
              f.sections.forEach((s: Section) => {
                if (!s.soft_delete) {
                  setI(5);
                  doc.text(`${s.name} | Compañia:  ${s.company}`, 50, i);
                  setI(5);
                  doc.text(
                    'Salida: ' + this.formatFecha(s.calendar_origin),
                    60,
                    i
                  );
                  setI(5);
                  doc.text(
                    'Llegada: ' + this.formatFecha(s.calendar_destination),
                    60,
                    i
                  );
                }
              });
            }
            if (f.detail) {
              setI(5);
              doc.text('Detalle servicios áereos: ', 40, i);
              setI(5);
              doc.text(f.detail, 45, i);
              if (f.detail.includes('\n')) {
                let n = f.detail.split('\n');
                setI(4 * n.length);
              } else {
                setI(5);
              }
            }
          }
        });
      }

      doc.setFontSize(12);
      if (this.budget.accommodation && this.budget.accommodation.length > 0) {
        setI(10);
        doc.text('Alojamientos: ', 30, i);
        doc.setFontSize(10);
        this.budget.accommodation.forEach((a: Accommodation) => {
          if (!a.soft_delete) {
            setI(10);
            doc.text(
              'Alojamiento: ' + a.name + ' / ' + a.nights + ' nts',
              40,
              i
            );
            if (a.detail) {
              setI(5);
              doc.text('Detalle: ', 40, i);
              setI(5);
              doc.text(a.detail, 45, i);
              if (a.detail.includes('\n')) {
                let n = a.detail.split('\n');
                setI(4 * n.length);
              } else {
                setI(3);
              }
            }
            if (a.hotels && a.hotels.length > 0) {
              setI(5);
              doc.text('Hoteles: ', 40, i);
              a.hotels.forEach((h: Hotel) => {
                if (!h.soft_delete) {
                  setI(5);
                  doc.text(
                    'Hotel: ' + h.name + ' / ' + h.nights + ' nts',
                    50,
                    i
                  );
                  setI(5);
                  doc.text('Regimen: ' + h.regime, 50, i);
                }
              });
            }
            if (a.extras && a.extras.length > 0) {
              setI(5);
              doc.text('Extras: ', 40, i);
              a.extras.forEach((e: Extra) => {
                if (!e.soft_delete) {
                  setI(5);
                  doc.text('Extra: ' + e.name, 50, i);
                }
              });
            }
          }
        });
      }

      doc.setFontSize(12);
      if (this.budget.transfers && this.budget.transfers.length > 0) {
        setI(10);
        doc.text('Traslados: ', 30, i);
        doc.setFontSize(10);
        this.budget.transfers.forEach((t: Transfer) => {
          if (!t.soft_delete) {
            setI(10);
            doc.text(`Traslado:  ${t.origin} / ${t.destination}`, 40, i);
            setI(5);
            doc.text(`Tipo: ${t.type} - Medio: ${t.conveyance}`, 40, i);
            if (t.detail) {
              setI(5);
              doc.text('Detalle: ', 40, i);
              setI(5);
              doc.text(t.detail, 45, i);
              if (t.detail.includes('\n')) {
                let n = t.detail.split('\n');
                setI(4 * n.length);
              } else {
                setI(3);
              }
            }
          }
        });
      }

      doc.setFontSize(12);
      if (this.budget.assistance && this.budget.assistance.length > 0) {
        setI(10);
        doc.text('Asistencias: ', 30, i);
        doc.setFontSize(10);
        this.budget.assistance.forEach((as: Assistance) => {
          if (!as.soft_delete) {
            setI(10);
            doc.text(`Nombre:  ${as.name}`, 40, i);
            setI(5);
            doc.text(`Tipo: ${as.type}`, 40, i);
            if (as.detail) {
              setI(5);
              doc.text('Detalle: ', 40, i);
              setI(5);
              doc.text(as.detail, 45, i);
              if (as.detail.includes('\n')) {
                let n = as.detail.split('\n');
                setI(4 * n.length);
              } else {
                setI(3);
              }
            }
          }
        });
      }

      doc.setFontSize(12);
      if (this.budget.excursions && this.budget.excursions.length > 0) {
        setI(10);
        doc.text('Excursiones: ', 30, i);
        doc.setFontSize(10);
        this.budget.excursions.forEach((ex: Excursion) => {
          if (!ex.soft_delete) {
            setI(10);
            doc.text(`Nombre:  ${ex.name}`, 40, i);
            setI(5);
            doc.text(`Fecha: ${ex.date}`, 40, i);
            if (ex.detail) {
              setI(5);
              doc.text('Detalle: ', 40, i);
              setI(5);
              doc.text(ex.detail, 45, i);
              if (ex.detail.includes('\n')) {
                let n = ex.detail.split('\n');
                setI(4 * n.length);
              } else {
                setI(3);
              }
            }
          }
        });
      }

      doc.setFontSize(12);
      if (this.budget.canneds && this.budget.canneds.length > 0) {
        setI(10);
        doc.text('Enlatados: ', 30, i);
        doc.setFontSize(10);
        this.budget.canneds.forEach((c: Canned) => {
          if (!c.soft_delete) {
            setI(10);
            doc.text(`Nombre:  ${c.name}`, 40, i);
            setI(5);
            doc.text(`Tipo: ${c.type}`, 40, i);
            if (c.detail) {
              setI(5);
              doc.text('Detalle: ', 40, i);
              setI(5);
              doc.text(c.detail, 45, i);
              if (c.detail.includes('\n')) {
                let n = c.detail.split('\n');
                setI(4 * n.length);
              } else {
                setI(3);
              }
            }
          }
        });
      }

      doc.setFontSize(12);
      if (this.budget.items && this.budget.items.length > 0) {
        setI(10);
        doc.text('Otros: ', 30, i);
        doc.setFontSize(10);
        this.budget.items.forEach((it: Item) => {
          if (!it.soft_delete) {
            setI(10);
            doc.text(`Nombre:  ${it.name}`, 40, i);
            if (it.detail) {
              setI(5);
              doc.text('Detalle: ', 40, i);
              setI(5);
              doc.text(it.detail, 45, i);
              if (it.detail.includes('\n')) {
                let n = it.detail.split('\n');
                setI(4 * n.length);
              } else {
                setI(3);
              }
            }
          }
        });
      }

      doc.setFontSize(12);
      setI(10);
      doc.text('Precio: $' + this.budget.total, 30, i);

      if (this.budget.detail) {
        setI(5);
        doc.setFontSize(10);
        doc.text('Detalle: ' + this.budget.detail, 30, i);
      }

      doc.save(
        'presupuesto-' +
          this.id +
          '-' +
          this.budget?.order?.name +
          '-' +
          this.budget?.order?.destination +
          '.pdf'
      );
    }
  }
}
