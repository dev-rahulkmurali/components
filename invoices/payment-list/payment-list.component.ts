import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { InvoicesService } from '@app/invoices/invoices.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {

  @Input() serviceRequestId: string;
  @Output() openPaymentForm = new EventEmitter();
  @ViewChild('cancelRef') cancelRef: ElementRef;

  paymentList: any = [];
  total: any = 0;
  contractAmount: any = 0;
  balanceAmount: any = 0;

  constructor(
    private _invoicesService: InvoicesService
  ) { }

  ngOnInit() {
    this.getPayments(this.serviceRequestId);
  }

  paymentForm() {
    this.cancelRef.nativeElement.click();
    setTimeout(() => {
      this.openPaymentForm.emit();
    }, 500);
  }

  getPayments(id: string) {
    this._invoicesService.getPayments(id).subscribe(response => {
      if ('200' === response.text) {
        this.paymentList = response.data;
        this.total = this.paymentList.reduce(function(accumulator: any, currentValue: any) {
          return accumulator + currentValue.amount;
        }, 0);
        this.contractAmount = this.paymentList.length > 0 ? this.paymentList[0]._refs.invoice.cost.amount : 0;
        this.balanceAmount = this.contractAmount - this.total;
      }
    });
  }
}
