import { Injectable } from '@angular/core';
import { ApiMethodService } from './../../shared/api-method.service';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private _apimethodService: ApiMethodService) { }


  getServices() {
    return this._apimethodService.get('services');
  }

  getService(id: any) {
    return this._apimethodService.get('services/' + id);
  }

  getCustomForms() {
    return this._apimethodService.get('custom-forms/meta');
  }

  deleteService(id: any) {
    return this._apimethodService.delete('services/' + id);
  }

  saveService(data: any) {
    return this._apimethodService.post('services', data);
  }

 uploadS3(data: any) {
    return this._apimethodService.post('upload/pre-signed-upload-urlsvices', data);
  }

  updateService(data: any) {
    return this._apimethodService.put('services', data);
  }

  addForm(data: any) {
    return this._apimethodService.post('custom-forms/meta', data);
  }

  deleteForms(id: any) {
    return this._apimethodService.delete('custom-forms/meta/' + id);
  }
  getTasks() {
    return this._apimethodService.get('tasks');
  }

  addTask(data: any) {
    return this._apimethodService.post('tasks', data);
  }

  deleteTask(taskId: any) {
    return this._apimethodService.delete('tasks/' + taskId);
  }

  getTask(taskId: any) {
    return this._apimethodService.get('tasks/' + taskId);
  }

  updateTask(data: any) {
    return this._apimethodService.put('tasks', data);
  }

  getUploadUrl(data: any) {
    return this._apimethodService.post('upload/pre-signed-upload-urls', data);
  }

  /*----------------------------FOOTER TEMPLATE-------------------------*/

  getTemplates(page: any = '') {
    return this._apimethodService.get('v3/quote-toc/list?pageSize=100000&page=' + page);
  }

  saveTemplate(data: any) {
    return  this._apimethodService.post('v3/quote-toc', data);
  }

  editTemplate(tempId: any, data: any) {
    return  this._apimethodService.put('v3/quote-toc/' + tempId, data);
  }

  deleteTemplate(tempId: any) {
    return  this._apimethodService.delete('v3/quote-toc/' + tempId);
  }

  getTemplate(tempId: any) {
    return  this._apimethodService.get('v3/quote-toc/' + tempId);
  }

}
