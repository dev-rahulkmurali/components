import { element } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ServicesService } from './../services.service';
import { Component, OnInit, Output, EventEmitter, Input, ElementRef, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as _ from 'lodash';


@Component({
  selector: 'app-add-form-template',
  templateUrl: './add-form-template.component.html',
  styleUrls: ['./add-form-template.component.css']
})
export class AddFormTemplateComponent implements OnInit {

  @Output() closeModal = new EventEmitter();
  @Output() refreshList = new EventEmitter();

  form: any = {
    'id': '-1',
    'label': '',
    'fields': [],
    'data': []
  };

  fields: Array<any> = [
  ];
  fieldActive = false;
  FieldData: any = {
    'label': '',
    'type': 'MULTI_VALUE',
    'fields': [],
  };
  formTypes = [{ 'id': 'TEXT', 'name': 'TEXT' }, { 'id': 'CHECKBOX', 'name': 'CHECKBOX' },
  { 'id': 'NUMBER', 'name': 'NUMBER' }, { 'id': 'DROPDOWN', 'name': 'DROPDOWN' }
  ];
  checkbox = false;
  dropdown = false;
  number = false;
  text = true;
  secondStep = false;
  dropdownValues: Array<any> = [''];
  dropIndex = 0;
  isManageActive = true;
  isActive = false;
  classValue = 10;
  addValue$ = new Subject<any[]>();
  divSize = 10;
  baseFieldLength = 1;
  maxLength = 4;
  allowedDivLength = 3;
  maxAllowedDivSize = 2;
  addDropdownValue$ = new Subject<any[]>();
  @ViewChild('closeDiv') closeDiv: ElementRef;
  dropDownList: any = [{
    dropdownValues: ['']
  }];
  numPattern = '/^[0-9]*$/';
  fieldDataValue: any = [];
  constructor(private serviceService: ServicesService, private toastr: ToastrService) {
    this.addListValues();
    this.addDropDown();
  }

  ngOnInit() {
  }

  addField() {
    this.fieldActive = true;
    this.fields.push({
      'id': '',
      'value': '',
      'label': '',
      'type': 'TEXT',
      'dropdownChoices': []
    });
    this.dropDownList.push({ 'dropdownValues': [] });
    // this.setFormData();
  }

  addListValues() {
    this.addValue$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((res: any) => {
      this.fields[res.index].dropdownChoices[res.dropindex] = res.event;
    });
  }

  setType(event: any, index: number) {
    this.fields[index].type = event.name;
    if (event.name === 'CHECKBOX') {
      this.fields[index].type = event.name;
    } if (event.name === 'TEXT') {
      this.fields[index].type = event.name;
    } if (event.name === 'NUMBER') {
      this.fields[index].type = event.name;
    }
    if (event.name === 'DROPDOWN') {
      this.fields[index].type = event.name;
    }

  }

  deleteField(index: number) {
    const fieldDeelete = _.cloneDeep(this.fields);
    fieldDeelete.splice(index, 1);
    this.fields = fieldDeelete;
    this.FieldData.fields.forEach(function (el: any, ind: any) {
      el.splice(index, 1);
    });


    if (this.dropDownList[index]) {
      this.dropDownList[index].dropdownValues = [];
    }
  }

  setCheckboxStatus(index: number, value: any) {
    this.fields[index].value = value;
  }

  onNext() {
    this.setFormData();
    this.isManageActive = false;
    this.isActive = true;
    this.secondStep = true;
  }

  setFormData() {
    if (this.FieldData.fields.length === 0) {
      this.FieldData.fields.push(this.fields);
    }
    const _that = this;
    this.FieldData.fields.forEach(function (value: any, index: any) {
      const fieldValue = value.length;
      _that.fields.forEach(function (result: any, i: any) {
        i = i + 1;
        if (i > fieldValue) {
          const resultValue = _.cloneDeep(result);
          value.push(resultValue);
        }
        _that.FieldData.fields[index] = value;
      });
    });


    const fieldLength = this.fields.length;
    this.classValue = fieldLength === this.baseFieldLength ? this.divSize : _.round(this.divSize / fieldLength);
    this.classValue = fieldLength >= this.maxLength && this.classValue >= this.allowedDivLength ?
      this.maxAllowedDivSize : this.classValue;
  }

  setClass(type: string) {
    if (type === 'manage') {
      this.isManageActive = true;
      this.secondStep = false;
      this.isActive = false;
    } else {
      this.setFormData();
      this.isManageActive = false;
      this.isActive = true;
      this.secondStep = true;
    }
  }

  deleteTrack(index: number) {
    return index;
  }

  deleteDataField(index: number) {
    this.FieldData.fields.splice(index, 1);
  }

  addDataField() {
    const cloneFields = _.cloneDeep(this.fields);
    this.FieldData.fields.push(cloneFields);
  }

  saveTemplate() {
    this.form.fields = this.fields;
    this.form.data = this.FieldData;
    this.serviceService.addForm(this.form).subscribe((res: any) => {
      this.refreshList.emit({ form: res });
      this.closeDiv.nativeElement.click();
      this.toastr.success('Form has been created!', 'Success!');
    });
  }

  trackIndex(index: number) {
    return index;
  }

  addDropDown() {
    this.addDropdownValue$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((res: any) => {
      this.dropDownList[res.index].dropdownValues.push('');
    });
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

}
