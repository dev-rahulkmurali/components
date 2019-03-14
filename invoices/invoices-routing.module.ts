import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Route, extract } from '@app/core';
import { InvoicesComponent } from '@app/invoices/invoices.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';

const routes: Routes = [
  Route.withShell([
    { path: 'invoices', component: InvoicesComponent, data: { title: 'Invoices' } },
    { path: 'invoice-details/:id', component: InvoiceDetailComponent, data: { title: 'Invoice Details' } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class InvoicesRoutingModule { }
