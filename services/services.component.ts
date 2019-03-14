import { AddFooterTemplateComponent } from './add-footer-template/add-footer-template.component';
import { Subject } from 'rxjs';
import { AddFormTemplateComponent } from './add-form-template/add-form-template.component';
import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  ComponentFactory,
  Renderer2, Output, EventEmitter, ChangeDetectorRef
} from '@angular/core';
import { AddServiceComponent } from './add-service/add-service.component';
import { EditServiceComponent } from './edit-service/edit-service.component';
import { ServicesService } from './services.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  services: any = [];
  activeTab = 'tasks';
  customForm: any;
  eventsSubject: Subject<void> = new Subject<void>();
  templates: any;

  @ViewChild('modalcontainer', { read: ViewContainerRef }) entry: ViewContainerRef;
  @Output() refreshForm = new EventEmitter();

  newCustomForm$ = new Subject();
  constructor(
    private renderer: Renderer2,
    private resolver: ComponentFactoryResolver,
    private servicesService: ServicesService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    this.listServices();
  }

  listServices() {
    this.servicesService.getServices().subscribe((res) => {
      this.services = res;
    });
  }

  openForm() {
    this.entry.clear();
    this.renderer.addClass(document.body, 'modal-open');
    const factory = this.resolver.resolveComponentFactory(AddServiceComponent);
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.closeModal.subscribe((res: any) => {
      componentRef.destroy();
      this.renderer.removeClass(document.body, 'modal-open');
    });
    componentRef.instance.refreshList.subscribe((res: any) => {
      this.listServices();
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  editForm(id: any) {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(EditServiceComponent);
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.serviceId = id;
    componentRef.instance.closeModal.subscribe((res: any) => {
      componentRef.destroy();
    });
    componentRef.instance.refreshList.subscribe((res: any) => {
      this.listServices();
    });
  }

  deleteService(id: string) {
    Swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this service template!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.servicesService.deleteService(id).subscribe((response) => {
          if (response.text === '200') {
            this.listServices();
            Swal(
              'Deleted!',
              'Your service template has been deleted.',
              'success'
            );
          } else {
            this.toastr.error('Something went wrong!', 'Oops!');
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'Cancelled',
          'Your service template is safe :)',
          'error'
        );
      }
    });
  }

  openJobForm() {
    if (this.entry) {
      this.entry.clear();
    }
    const factory = this.resolver.resolveComponentFactory(AddFormTemplateComponent);
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.refreshList.subscribe((res: any) => {
      this.customForm = res;
    });
  }

  openTaskForm() {
    this.eventsSubject.next();
  }

  openFooterForm() {
    if (this.entry) {
      this.entry.clear();
    }
    const factory = this.resolver.resolveComponentFactory(AddFooterTemplateComponent);
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.refreshList.subscribe((res: any) => {
      this.getTemplates();
    });
  }

  getTemplates() {
    this.servicesService.getTemplates().subscribe(res => {
      this.templates = res;
    });
  }

}
