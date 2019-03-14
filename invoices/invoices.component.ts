import { Subject } from 'rxjs/Subject';
import { Component, OnInit } from '@angular/core';
import { InvoicesService } from './invoices.service';
import * as moment from 'moment';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {

  allInvoices: Array<object> = [];
  pendingInvoices: Array<object> = [];
  upcomingInvoices: Array<object> = [];
  clients: Array<object> = [];
  contracts: Array<object> = [];
  filterActive = false;
  search = '';

  filter = {
    invoiceDate: {
      from: '',
      to: ''
    },
    amount: {
      from: '',
      to: ''
    },
    invoiceTypes: [
      'SERVICE',
      'CONTRACT'
    ],
    page: {
      pageNum: 0,
      pageSize: 10
    }
  };
  isReset: Subject<void> = new Subject<void>();
  isFilter = false;

  constructor(
    private _invoicesService: InvoicesService
  ) {
    this._invoicesService.getSearchValue().subscribe(search => {
      this.search = search;
    });
  }

  ngOnInit() {
    this.getAllInvoices();
    this.getPendingInvoices();
    this.getUpcomingInvoices();
  }

  closeFilter() {
    this.filterActive = false;
  }

  removeCloseButton() {
    this.isFilter = false;
    this.filterActive = false;
  }

  filterClick() {
    this.filterActive = true;
  }

  getAllInvoices() {
    const options = Object.assign({}, this.filter);
    this._invoicesService.getInvoices(this.filterOptions(options)).subscribe(response => {
      response.forEach((element: any) => {
        this.allInvoices.push(element);
      });
    });
  }

  getPendingInvoices() {
    const params = {
      invoiceStatus: 'Pending'
    };

    const options = Object.assign({}, this.filter, params);

    this._invoicesService.getInvoices(this.filterOptions(options)).subscribe(response => {
      response.forEach((element: any) => {
        this.pendingInvoices.push(element);
      });
    });
  }

  getUpcomingInvoices() {
    let options = {};
    const params = {
      invoiceDate: {
        from: moment().format('YYYY-MM-DD'),
        to: moment().add(7, 'days').format('YYYY-MM-DD')
      }
    };

    if (this.filter.invoiceDate.from !== '' && this.filter.invoiceDate.to !== '') {
      options = Object.assign({}, params, this.filter);
    } else {
      options = Object.assign({}, this.filter, params);
    }

    this._invoicesService.getInvoices(this.filterOptions(options)).subscribe(response => {
      response.forEach((element: any) => {
        this.upcomingInvoices.push(element);
      });
    });
  }

  filterOptions(options: any) {
    if ('' === options.invoiceDate.from || '' === options.invoiceDate.to) {
      delete options.invoiceDate;
    }
    return options;
  }

  applyFilter(filter: any) {
    const credentials = {
      invoiceDate: {
        from: filter.invoice.fromDate ? moment.unix(filter.invoice.fromDate.epoc).format('YYYY-MM-DD') : '',
        to: filter.invoice.toDate ? moment.unix(filter.invoice.toDate.epoc).format('YYYY-MM-DD') : ''
      },
      amount: {
        from: filter.invoice.minAmount ? filter.invoice.minAmount : '',
        to: filter.invoice.maxAmount ? filter.invoice.maxAmount : '',
      }
    };

    if ('' !== filter.invoice.type) {
      credentials['invoiceTypes'] = [filter.invoice.type];
    } else {
      credentials['invoiceTypes'] = [];
    }

    this.filter = Object.assign(this.filter, credentials);
    this.filter.page.pageNum = 0;
    this.allInvoices = [];
    this.pendingInvoices = [];
    this.upcomingInvoices = [];
    this.isFilter = true;
    this.closeFilter();
    this.getAllInvoices();
    this.getPendingInvoices();
    this.getUpcomingInvoices();
  }

  onScroll() {
    this.filter.page.pageNum = this.filter.page.pageNum + 1;
    this.getAllInvoices();
    this.getPendingInvoices();
    this.getUpcomingInvoices();
  }

  removeFilter() {
    this.isFilter = false;
    this.isReset.next();
    this.filter = {
      invoiceDate: {
        from: '',
        to: ''
      },
      amount: {
        from: '',
        to: ''
      },
      invoiceTypes: [
        'SERVICE',
        'CONTRACT'
      ],
      page: {
        pageNum: 0,
        pageSize: 10
      }
     };

    this.filter.page.pageNum = 0;
    this.allInvoices = [];
    this.pendingInvoices = [];
    this.upcomingInvoices = [];
    this.closeFilter();
    this.getAllInvoices();
    this.getPendingInvoices();
    this.getUpcomingInvoices();
  }

}
