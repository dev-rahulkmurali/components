import { ToastrService } from 'ngx-toastr';
import { EditFormTemplateComponent } from './../edit-form-template/edit-form-template.component';
import { AddFormTemplateComponent } from './../add-form-template/add-form-template.component';
import { ServicesService } from './../services.service';
import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  ComponentFactory,
  Renderer2, Output, EventEmitter, Input
} from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-template',
  templateUrl: './form-template.component.html',
  styleUrls: ['./form-template.component.css']
})
export class FormTemplateComponent implements OnInit {

  customForms: any;
  @Input() set customForm(value: any) {
    if (value) {
      this.customForms.push(value.form);
    }
  }

  @ViewChild('modalcontainerRef', { read: ViewContainerRef }) entryForm: ViewContainerRef;
  constructor(private renderer: Renderer2,
    private resolver: ComponentFactoryResolver,
    private serviceService: ServicesService,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getCustomForms();
  }

  getCustomForms() {
    this.serviceService.getCustomForms().subscribe((res: any) => {
      this.customForms = res;
    });
  }

  deleteCustomForm(id: number, index: number) {
    Swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this task!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.serviceService.deleteForms(id).subscribe(response => {
          if (response) {
            Swal(
              'Deleted!',
              'Form has been deleted.',
              'success'
            );
            this.customForms.splice(index, 1);
          } else {
            this.toastr.error('Something went wrong!', 'Oops!');
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'Cancelled',
          'Your form is safe :)',
          'error'
        );
      }
    });
  }

  editJobForm(id: any, index: number) {
    this.entryForm.clear();
    this.renderer.addClass(document.body, 'modal-open');
    const factory = this.resolver.resolveComponentFactory(EditFormTemplateComponent);
    const componentRef = this.entryForm.createComponent(factory);
    componentRef.instance.customformId = id;
    componentRef.instance.customIndex = index;
    componentRef.instance.customData = this.customForms[index];
    componentRef.instance.closeModal.subscribe((res: any) => {
      this.entryForm.remove();
    });
    componentRef.instance.refreshList.subscribe((res: any) => {
      this.customForms[res.index] = res.form;

    });
  }
}
