import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Item } from 'src/app/interfaces/item';
import { BudgetService } from 'src/app/service/budget.service';
import { ErrorService } from 'src/app/service/error.service';
import { ItemService } from 'src/app/service/item.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<number>();
  budgetId: number;
  loading = true;
  items: Item[] = [];

  constructor(
    private errorService: ErrorService,
    private toastr: ToastrService,
    private budgetService: BudgetService,
    private itemService: ItemService
  ) {
    this.budgetId = budgetService.getId();
  }

  ngOnInit(): void {
    if (this.budgetId) {
      this.getItems();
    }
  }

  getItems(){
    this.itemService.getByBudget(this.budgetId).subscribe({
      next: (data: Item[]) => {
        this.items = data;
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  editItem(id: number) {
    this.newItemEvent.emit(id);
  }

  deleteItem(id: number) {
    this.loading = true;
    this.itemService.deleteItem(id).subscribe({
      next: () => {
        this.toastr.info('Registro Eliminado', 'Exito');
        this.getItems()
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

}
