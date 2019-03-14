import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { InvoicesService } from '@app/invoices/invoices.service';


@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent implements OnInit {

  invoice = {
    entityLogoURL: '',
    status: '',
    amount: 0,
    assignedServiceRequests: ''
  };

  constructor(
    private route: ActivatedRoute,
    private _invoicesService: InvoicesService
  ) { }

  ngOnInit() {
    // const id = this.route.snapshot.paramMap.get('id');
    const id = '59cb924b1d58302882753805'; // This is contract ID.
    this.getInvoiceDetails(id);
  }

  getInvoiceDetails(id: string) {
    this._invoicesService.getInvoice(id).subscribe(response => {
      if ('200' === response.text) {
        this.invoice = response.data;
        console.log('invoice', this.invoice);
      }
    });
  }
}
