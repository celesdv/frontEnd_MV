import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBudgetComponent } from './components/add-budget/add-budget.component';
import { BudgetComponent } from './components/budget/budget.component';
import { ClientsComponent } from './components/clients/clients.component';
import { CountsComponent } from './components/counts/counts.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormClientComponent } from './components/form-client/form-client.component';
import { FormCountComponent } from './components/form-count/form-count.component';
import { FormOrderComponent } from './components/form-order/form-order.component';
import { FormSupplierComponent } from './components/form-supplier/form-supplier.component';
import { FormUserComponent } from './components/form-user/form-user.component';
import { LoginComponent } from './components/login/login.component';
import { OrdersComponent } from './components/orders/orders.component';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { UsersComponent } from './components/users/users.component';
import { AuthGuard } from './utils/auth.guard';
import { AdminGuard } from './utils/admin.guard';
import { BudgetResumenComponent } from './components/budget-resumen/budget-resumen.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { FormBookingComponent } from './components/form-booking/form-booking.component';
import { AccountingMenuComponent } from './components/accounting-menu/accounting-menu.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'clients', component: ClientsComponent, canActivate: [AuthGuard] },
  { path: 'clients/form', component: FormClientComponent, canActivate: [AuthGuard] },
  { path: 'clients/form/:id', component: FormClientComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'users/form', component: FormUserComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'users/form/:id', component: FormUserComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'counts', component: CountsComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'counts/form', component: FormCountComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'counts/form/:id', component: FormCountComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'suppliers', component: SuppliersComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'suppliers/form', component: FormSupplierComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'suppliers/form/:id', component: FormSupplierComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'orders/form', component: FormOrderComponent, canActivate: [AuthGuard] },
  { path: 'orders/form/:id', component: FormOrderComponent, canActivate: [AuthGuard] },
  { path: 'budgets', component: BudgetComponent, canActivate: [AuthGuard] },
  { path: 'budgets/form', component: AddBudgetComponent, canActivate: [AuthGuard] },
  { path: 'budgets/form/:id', component: AddBudgetComponent, canActivate: [AuthGuard] },
  { path: 'budgets/resumen/:id', component: BudgetResumenComponent, canActivate: [AuthGuard] },
  { path: 'bookings', component: BookingsComponent, canActivate: [AuthGuard] },
  { path: 'bookings/form', component: FormBookingComponent, canActivate: [AuthGuard] },
  { path: 'bookings/form/:id', component: FormBookingComponent, canActivate: [AuthGuard] },
  { path: 'accounting', component: AccountingMenuComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
