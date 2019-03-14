import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ServicesService } from './../services.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '@env/environment';
import * as _ from 'lodash';

export interface Service {
  id: string;
  servicesName: string;
  serviceDescription: string;
  totalCost: number;
  totalHours: number;
  totalMinutes: number;
  showOnPublicPage: boolean;
  customForms: any;
  parts: any[];
  notes: any[];
  tasks: any[];
  amount: number;
  discount: number;
  discountType: string;
}

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrls: ['./edit-service.component.scss']
})
export class EditServiceComponent implements OnInit {

  @Output() closeModal = new EventEmitter();
  @Output() refreshList = new EventEmitter();
  @Input() serviceId = '';

  @ViewChild('cancelRef') cancelRef: ElementRef;

  customForms: any = [];
  tasks: any[] = [];
  taskId = '';
  selctedFormIds: any = [];
  formIndex = '';
  subtotal = 0;
  deduction = 0;
  gst = 0;

  service: Service = {
    id: '',
    servicesName: '',
    serviceDescription: '',
    totalCost: 0,
    totalHours: 0,
    totalMinutes: 0,
    showOnPublicPage: false,
    customForms: [],
    parts: [],
    notes: [],
    tasks: [],
    amount: 0,
    discount: 0,
    discountType: 'Percentage'
  };

  public options: Object = {
    placeholderText: 'Add Your Note Here!',
    charCounterCount: false,
    toolbarBottom: false,
    quickInsertTags: [''],
    toolbarButtons: ['bold', 'italic', 'underline', '|', 'fontFamily', 'fontSize',
                     'strikeThrough', 'subscript', 'superscript', '|',
                     'insertLink', 'insertImage', 'insertFile', 'outdent', 'indent',  '-',
                     'quote', 'paragraphFormat', 'align', 'formatOL', 'formatUL', '|',
                     'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|',
                     'undo', 'redo'
                    ],
    requestHeaders: {
      Authorization: localStorage.getItem('serv_jwtToken'),
      Accept: 'application/json'
    },
    fileUploadURL: environment.API_URL + 'v3/files/upload',
    fileUploadMethod: 'POST',
    fileMaxSize: 20 * 1024 * 1024,
    fileAllowedTypes: ['*'],
    imageUploadURL: environment.API_URL + 'v3/files/upload',
    imageUploadMethod: 'POST',
    imageMaxSize: 5 * 1024 * 1024,
    imageAllowedTypes: ['jpeg', 'jpg', 'png'],
    events : {
      'froalaEditor.focus' : function(e: any, editor: any) {
        return true;
      },
      'froalaEditor.file.beforeUpload' : function(e: any, editor: any, files: any) {
        return true;
      },
      'froalaEditor.file.uploaded' : function(e: any, editor: any, response: any) {
        return true;
      },
      'froalaEditor.file.error' : function(e: any, editor: any, error: any, response: any) {
        return true;
      }
    }
  };

  constructor(
    private servicesService: ServicesService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getTasks();
    this.servicesService.getCustomForms().subscribe(response => {
      this.customForms = response;
    });
    this.servicesService.getService(this.serviceId).subscribe((res) => {
      this.service.id = res.data.id;
      this.service.servicesName = res.data.servicesName;
      this.service.serviceDescription = res.data.serviceDescription;
      this.service.totalCost = res.data.totalCost;
      this.service.totalHours = res.data.totalHours;
      this.service.totalMinutes = res.data.totalMinutes;
      this.service.customForms = res.data.customForms || [];
      this.service.customForms.forEach((element: any) => {
        this.selctedFormIds.push(element.id);
      });
      this.formIndex = res.data.customForms.length > 0 ? res.data.customForms[0].id : '';
      const tasks = res.data.tasks || [];
      this.service.tasks = tasks;
      const parts = res.data.parts || [];
      parts.map((pt: any) => {
        pt.cost = parseInt(pt.partCount, 10) * parseInt(pt.partCost, 10);
      });
      this.service.parts = parts;
      this.service.notes = res.data.notes || [];
      this.service.amount = res.data.amount;
      this.service.discount = res.data.discount;
      this.service.discountType = res.data.discountType;
    });
  }

  getTasks() {
    this.servicesService.getTasks().subscribe(response => {
      if ('200' === response.text) {
        this.tasks = response.data;
      }
    });
  }

  fillTaskDetails(event: any, taskIndex: any) {
    const taskObj: any = _.find(this.tasks, { id: event.id });
    this.service.tasks[taskIndex] = taskObj;
  }

  close() {
    this.closeModal.emit();
  }

  addForm() {
    if (this.formIndex !== '') {
      if (!this.selctedFormIds.includes(this.formIndex)) {
        this.selctedFormIds.push(this.formIndex);
        const cFroms: any = _.find(this.customForms, { id: this.formIndex });
        this.service.customForms.push(cFroms.data);
      }
    }
  }

  removeForm(formId: string) {
    const index = this.selctedFormIds.indexOf(formId);
    this.selctedFormIds.splice(index, 1);
    this.service.customForms = this.service.customForms.filter((formElement: any) => {
      return formElement.id !== formId;
    });
  }

  createField(i: string, ii: string) {
    const fields = this.service.customForms[i].fields[ii].map((obj: any) => {
      return {
        label: obj.label,
        type: obj.type,
        value: ''
      };
    });
    this.service.customForms[i].fields.push(fields);
  }

  deleteField(i: number, ii: number) {
    this.service.customForms[i].fields.splice(ii, 1);
  }

  createTaskList() {
    this.service.tasks.push({
      taskName: '',
      durationHours: 0,
      durationMinutes: 0,
      cost: 0
    });
  }

  deleteTaskList(index: number) {
    this.service.tasks.splice(index, 1);
  }

  createPartsList() {
    this.service.parts.push({
      partName: '',
      partCost: 0,
      partCount: 0,
      cost: 0
    });
  }

  deletePartsList(index: number) {
    this.service.parts.splice(index, 1);
  }

  createNoteList() {
    this.service.notes.push({
      content: '',
      privateFlag: false
    });
  }

  onDurationChange() {

    const totalHours = this.service.tasks.reduce(function (total: any, element: any) {
      return total + parseInt(element.durationHours, 10);
    }, 0);

    const totalMinutes = this.service.tasks.reduce(function (total: any, element: any) {
      return total + parseInt(element.durationMinutes, 10);
    }, 0);

    this.service.totalHours = totalHours;
    this.service.totalMinutes = totalMinutes;

    this.calculateSubTotal();
    this.calculateDiscount();
    this.calculateGrandTotal();
  }

  getTotalDuration(hours: any, minutes: any) {
    const seconds = (parseInt(hours, 10) * 60 * 60) + (minutes * 60);
    return new Date(1000 * seconds).toISOString().substr(11, 5);
  }

  onPartValueChange($event: any, index: any) {
    const total = this.service.parts[index].partCount * this.service.parts[index].partCost;
    this.service.parts[index].cost = total;
    this.calculateSubTotal();
    this.calculateDiscount();
    this.calculateGrandTotal();
  }

  onCostChange($event: any) {
    this.calculateSubTotal();
    this.calculateDiscount();
    this.calculateGrandTotal();
  }

  calculateSubTotal() {
    const total_task_cost = this.service.tasks.reduce(function (total: any, element: any) {
      return total = total + parseFloat(element.cost);
    }, 0);

    const total_parts_cost = this.service.parts.reduce(function (total: any, element: any) {
      return total = total + parseFloat(element.cost);
    }, 0);

    this.service.amount = total_task_cost + total_parts_cost;
  }

  calculateDiscount() {
    let deduction = 0;
    if ('percentage' === this.service.discountType) {
      deduction = this.service.amount * (this.service.discount / 100);
    } else {
      deduction = this.service.discount;
    }
    this.deduction = deduction;
    this.calculateGrandTotal();
  }

  applyGst() {
    this.calculateGrandTotal();
  }

  calculateGrandTotal() {
    this.service.totalCost = (this.service.amount + this.gst) - this.deduction;
  }

  updateService(serviceForm: NgForm) {
    this.servicesService.updateService(this.service).subscribe((response) => {
      if (response.text === '200') {
        this.cancelRef.nativeElement.click();
        this.refreshList.emit();
        this.toastr.success('Service template has been updated!', 'Success!');
      } else {
        this.toastr.error('Something went wrong!', 'Oops!');
      }
    });
  }

}
