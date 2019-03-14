import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ServicesService } from './../services.service';
import { Component, OnInit, Renderer2, ComponentFactoryResolver, Input, Output,
   EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-edit-footer-template',
  templateUrl: './edit-footer-template.component.html',
  styleUrls: ['./edit-footer-template.component.css']
})
export class EditFooterTemplateComponent implements OnInit {
  @Input() template: any;
  @Output() refreshList = new EventEmitter();
  @ViewChild('cancelRef') cancelRef: ElementRef;

  constructor(private servicesService: ServicesService, private renderer: Renderer2,
    private resolver: ComponentFactoryResolver, private toastr: ToastrService) { }

  ngOnInit() {
  }

  saveTemplate(templateForm: NgForm) {
    this.servicesService.editTemplate(this.template.id, this.template).subscribe(res => {
      if (res) {
        this.cancelRef.nativeElement.click();
        this.refreshList.emit();
        this.toastr.success('Footer template has been updated!', 'Success!');
    }
  });
  }
}
