import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesRoutingModule } from '@app/invoices/invoices-routing.module';
import { InvoicesComponent } from '@app/invoices/invoices.component';
import { SharedModule } from '@app/shared';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { MomentModule } from 'angular2-moment';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';

import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { AddPaymentComponent } from './add-payment/add-payment.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxMyDatePickerModule.forRoot(),
    InvoicesRoutingModule,
    MomentModule
  ],
  declarations: [
    InvoicesComponent,
    InvoiceListComponent,
    InvoiceDetailComponent,
    PaymentListComponent,
    AddPaymentComponent
  ],
  entryComponents: [
    AddPaymentComponent,
    PaymentListComponent
  ],
})
export class InvoicesModule { }
