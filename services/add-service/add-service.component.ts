import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ServicesService } from './../services.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '@env/environment';
import * as _ from 'lodash';

export interface Service {
  servicesName: string;
  serviceDescription: string;
  totalCost: number;
  totalHours: number;
  totalMinutes: number;
  showOnPublicPage: boolean;
  customForms: any[];
  parts: any[];
  notes: any[];
  tasks: any[];
  amount: number;
  discount: number;
  discountType: string;
}

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent implements OnInit {

  @Output() closeModal = new EventEmitter();
  @Output() refreshList = new EventEmitter();

  @ViewChild('cancelRef') cancelRef: ElementRef;

  customForms: any[] = [];
  tasks: any[] = [];
  selctedFormIds: any[] = [];
  formIndex = '';
  subtotal = 0;
  deduction = 0;
  gst = 0;
  uploadUrl = '';
  initControls: any;

  service: Service = {
    servicesName: '',
    serviceDescription: '',
    totalCost: 0,
    totalHours: 0,
    totalMinutes: 0,
    showOnPublicPage: false,
    customForms: [],
    parts: [{
      partName: '',
      partCost: 0,
      partCount: 0,
      cost: 0
    }],
    notes: [{
      content: '',
      privateFlag: false
    }],
    tasks: [{
      id: '',
      taskName: '',
      durationHours: 0,
      durationMinutes: 0,
      cost: 0
    }],
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
  ) {
  }

  ngOnInit() {
    this.getCustomForms();
    this.getTasks();
  }

  public initialize(initControls: any) {
    this.initControls = initControls;
  }

  close() {
    this.closeModal.emit();
  }

  getCustomForms() {
    this.servicesService.getCustomForms().subscribe(response => {
      this.customForms = response;
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
    this.onDurationChange();
  }

  addForm() {
    if (this.formIndex !== '') {
      if (!this.selctedFormIds.includes(this.customForms[this.formIndex].id)) {
        this.selctedFormIds.push(this.customForms[this.formIndex].id);
      }
    }
  }

  isSelected(formId: string) {
    if (this.selctedFormIds.includes(formId)) {
      return true;
    }
  }

  removeForm(formId: string) {
    const index = this.selctedFormIds.indexOf(formId);
    this.selctedFormIds.splice(index, 1);
  }

  createField(index: string) {
    const fields = this.customForms[index].fields.map((obj: any) => {
      return {
        label: obj.label,
        type: obj.type,
        value: ''
      };
    });
    this.customForms[index].data.fields.push(fields);
  }

  deleteField(i: number, ii: number) {
    this.customForms[i].data.fields.splice(ii, 1);
  }

  saveService(serviceForm: NgForm) {
    this.customForms.forEach(element => {
      if (this.selctedFormIds.includes(element.id)) {
        this.service.customForms.push(element.data);
      }
    });
    this.servicesService.saveService(this.service).subscribe(response => {
      if (response.text === '200') {
        serviceForm.form.reset();
        this.service.totalCost = 0;
        this.service.totalHours = 0;
        this.service.totalMinutes = 0,
        this.selctedFormIds = [];
        this.service.parts = [{
          partName: '',
          partCost: 0,
          partCount: 0,
          cost: 0
        }];
        this.service.notes = [{
          content: '',
          privateFlag: false
        }];
        this.service.tasks = [{
          id: '',
          taskName: '',
          durationHours: 0,
          durationMinutes: 0,
          cost: 0
        }];
        this.cancelRef.nativeElement.click();
        this.refreshList.emit();
        this.toastr.success('Service template has been created!', 'Success!');
      } else {
        this.toastr.error('Something went wrong!', 'Oops!');
      }
    });
  }

  createTaskList() {
    this.service.tasks.push({
      id: '',
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
}
