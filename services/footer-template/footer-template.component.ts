import { EditFooterTemplateComponent } from './../edit-footer-template/edit-footer-template.component';
import { AddFooterTemplateComponent } from './../add-footer-template/add-footer-template.component';
import { ServicesService } from './../services.service';
import { Component, OnInit, Input, ViewChild, ViewContainerRef, Output, EventEmitter, Renderer2,
  ComponentFactoryResolver } from '@angular/core';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-footer-template',
  templateUrl: './footer-template.component.html',
  styleUrls: ['./footer-template.component.css']
})
export class FooterTemplateComponent implements OnInit {

  templates: any = [];
  page = 1;
  @Input() set footerTemplates(value: any) {
    if (value) {
      this.templates = value;
    }
  }

  @Output() refreshList = new EventEmitter();
  @ViewChild ('editmodalcontainer', { read: ViewContainerRef }) entry: ViewContainerRef;

  constructor(private servicesService: ServicesService, private renderer: Renderer2,
    private resolver: ComponentFactoryResolver,
) { }

  ngOnInit() {
    this.getTemplates();
  }

  getTemplates() {
     this.servicesService.getTemplates(this.page).subscribe(res => {
      this.templates = res;
    });
  }

  editFooterForm(template: string) {
    if (this.entry) {
      this.entry.clear();
    }
    const factory = this.resolver.resolveComponentFactory(EditFooterTemplateComponent);
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.template = template;
    componentRef.instance.refreshList.subscribe((res: any) => {
      this.getTemplates();
      this.entry.clear();
    });
  }


  deleteTemplate(templateId: any, index: number) {
    Swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this template',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result: any) => {
      if (result.value) {
        this.servicesService.deleteTemplate(templateId).subscribe(response => {
          this.getTemplates();
          Swal(
            'Deleted!',
            'The template has been deleted.',
            'success'
          );
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'Cancelled',
          'The template is safe :)',
          'error'
        );
      }
    });
  }

  close() {
    if (this.entry) {
      this.entry.clear();
    }
  }

}
