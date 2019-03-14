import { Template } from './../../communication-templates/sms-template/sms-template.component';
import { ToastrService } from 'ngx-toastr';
import { ServicesService } from './../services.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-add-footer-template',
  templateUrl: './add-footer-template.component.html',
  styleUrls: ['./add-footer-template.component.css']
})
export class AddFooterTemplateComponent implements OnInit {

  @Output() refreshList = new EventEmitter();
  template: any = {
    name: '',
    template: '',
  };
  @ViewChild ('cancelRef') cancelRef: ElementRef;
  @Input() set editTemplate(value: any)  {
    this.template = value;
  }
  constructor(private servicesService: ServicesService, private toastr: ToastrService) { }

  ngOnInit() {
  }

 saveTemplate(templateForm: NgForm) {
      this.servicesService.saveTemplate(this.template).subscribe(res => {
        if (res) {
          this.cancelRef.nativeElement.click();
          this.refreshList.emit();
          this.toastr.success('Footer template has been created!', 'Success!');
      }
    });
  }



}
