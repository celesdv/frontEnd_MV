import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  disable: boolean = true;
  token = localStorage.getItem('token');
  user: any;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.setId(0)
    this.isAdmin();
  }

  isAdmin() {
    if (this.token && this.token != '') {
      this.user = JSON.parse(atob(this.token.split('.')[1]));
      if (this.user.roleId === 1) {
        this.disable = false;
      }
    }
  }
}
