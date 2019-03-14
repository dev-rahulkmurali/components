import { Injectable } from '@angular/core';
import { ApiMethodService } from '@app/shared/api-method.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  private subject = new Subject<any>();

  constructor(
    private _apimethodService: ApiMethodService
  ) { }

  getInvoices(params: any) {
    return this._apimethodService.post('v3/invoices/list', params);
  }

  getClients() {
    return this._apimethodService.post('v3/clients/list');
  }

  getContracts() {
    return this._apimethodService.get('v3/client-contracts/all');
  }

  search(search: string) {
      this.subject.next(search);
  }

  getSearchValue(): Observable<any> {
    return this.subject.asObservable();
  }

  getInvoice(id: string) {
    return this._apimethodService.get('find/serviceContractReqForReport/' + id);
  }

  savePayment(data: any) {
    return this._apimethodService.post('service-requests/' + data.serviceRequestId + '/payments', data);
  }

  getPayments(id: string) {
    return this._apimethodService.get('service-requests/' + id + '/payments');
  }

  downloadInvoice(data: any) {
    return this._apimethodService.post('reports/job/sr-invoice/pdf/url', data);
  }
}
