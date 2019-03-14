import { Component, OnInit, Input, ViewContainerRef, ViewChild, ElementRef,
  ComponentFactoryResolver,
  ComponentRef,
  ComponentFactory,
  Renderer2 } from '@angular/core';
import * as _ from 'lodash';
import { environment } from '@env/environment';
import { AddPaymentComponent } from '@app/invoices/add-payment/add-payment.component';
import { PaymentListComponent } from '@app/invoices/payment-list/payment-list.component';
import { InvoicesService } from '@app/invoices/invoices.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {

  @Input() listData: Array<object> = [];
  @ViewChild('modalcontainer', { read: ViewContainerRef }) entry: ViewContainerRef;
  @ViewChild('paymentAddRef', { read: ElementRef }) paymentAddRef: ElementRef;

  sortData = {
    sort: 'asc',
    field: 'invoiceDate'
  };

  PRE_SITE_URL = environment.PRE_SITE_URL;

  constructor(
    private resolver: ComponentFactoryResolver,
    private renderer: Renderer2,
    private _invoicesService: InvoicesService
  ) { }

  ngOnInit() {
  }

  sortContract(sortBy: any ) {
    if (sortBy === this.sortData.field) {
      this.sortData.sort = (this.sortData.sort === 'asc') ? 'desc' : 'asc';
      this.listData = _.orderBy(this.listData, [this.sortData.field], [this.sortData.sort]);
    } else {
      this.sortData.field = sortBy;
      this.sortData.sort = 'asc';
      this.listData = _.orderBy(this.listData, [this.sortData.field], [this.sortData.sort]);
    }
  }

  openPaymentForm() {
    if (this.entry) {
      this.entry.clear();
    }
    const factory = this.resolver.resolveComponentFactory(AddPaymentComponent);
    const componentRef = this.entry.createComponent(factory);
  }

  openPaymentList(serviceRequestId: string) {
    if (this.entry) {
      this.entry.clear();
    }
    const factory = this.resolver.resolveComponentFactory(PaymentListComponent);
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.serviceRequestId = serviceRequestId;
    componentRef.instance.openPaymentForm.subscribe((res: any) => {
      this.paymentAddRef.nativeElement.click();
    });
  }

  downloadInvoice(serviceRequestId: string) {
    const data = {
      recordIds: [serviceRequestId]
    };
    this._invoicesService.downloadInvoice(data).subscribe(response => {
      window.open(response[0].s3Url);
    });
  }
}
