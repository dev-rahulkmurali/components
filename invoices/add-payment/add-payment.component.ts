import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TeamService } from '@app/settings/team/team.service';
import { InvoicesService } from '@app/invoices/invoices.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

interface Payment {
    amount: number;
    collectedBy: string;
    collectedTime: string;
    invoiceId: string;
    linkedPaymentIdRef: string;
    paymentMethod: string;
    referenceNumber: string;
    serviceRequestId: string;
    serviceContractId: Boolean;
    targetType: string;
    typeOfPayment: string;
}

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss']
})
export class AddPaymentComponent implements OnInit {

  collectedTime = new Date();

  paymentPayload: Payment = {
    amount: 0,
    collectedBy: '',
    collectedTime: '',
    invoiceId: '',
    linkedPaymentIdRef: '',
    paymentMethod: 'CASH',
    referenceNumber: '',
    serviceRequestId: '',
    serviceContractId: null,
    targetType: '',
    typeOfPayment: 'PAYMENT'
  };

  users: any = [];
  invoices: any = [];
  @ViewChild('cancelRef') cancelRef: ElementRef;

  constructor(
    private _teamService: TeamService,
    private _invoicesService: InvoicesService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getUsers();
    this.getInvoices();
  }

  getUsers() {
    this._teamService.getUsers(false).subscribe(response => {
      this.users = response;
    });
  }

  getInvoices() {
    this._invoicesService.getInvoices({}).subscribe(response => {
      this.invoices = response;
    });
  }

  updateServiceRequestId(invoice: any) {
    this.paymentPayload.targetType = invoice.type;
    this.paymentPayload.serviceRequestId = invoice.serviceInvoice.serviceRequestId;
  }

  savePayment(paymentForm: NgForm) {
    this.paymentPayload.collectedTime = JSON.parse(JSON.stringify(this.collectedTime));
    this._invoicesService.savePayment(this.paymentPayload).subscribe(response => {
      if (response.text === '200') {
        paymentForm.form.reset();
        this.cancelRef.nativeElement.click();
        this._toastr.success('Payment has been created!', 'Success!');
      } else {
        this._toastr.error('Something went wrong!', 'Oops!');
      }
    });
  }
}
