import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesService } from './../services.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.scss']
})
export class ListTaskComponent implements OnInit {

  tasks: any = [];
  taskForm: FormGroup;
  taskId: any = '';
  task = {};
  hideForm: Boolean = true;
  eventsSubscription: any;

  @ViewChild('taskName') taskName: ElementRef;
  @Input() events: Observable<void>;

  constructor(
    private fb: FormBuilder,
    private _servicesService: ServicesService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.listTasks();
    this.createForm();
    this.eventsSubscription = this.events.subscribe(() => {
      this.hideForm = false;
      // this.resetForm();
      setTimeout(() => {
        this.taskName.nativeElement.focus();
      }, 500);
    });
  }

  createForm() {
    this.taskForm = this.fb.group({
      taskName: ['', Validators.required ],
      description: ['' ],
      cost: ['', Validators.required ],
      durationHours: ['', Validators.required ],
      durationMinutes: ['', Validators.required ]
    });
  }

  listTasks() {
    this._servicesService.getTasks().subscribe(response => {
      this.tasks = response.data;
    });
  }

  resetForm() {
    this.taskForm.reset();
    this.taskId = '';
    this.hideForm = true;
  }

  onSubmit() {
    const data = this.taskForm.value;
    if ('' === this.taskId) {
      this._servicesService.addTask(data).subscribe(response => {
        if (response.text === '200') {
          this.toastr.success('Task has been created!', 'Success!');
          this.listTasks();
          this.resetForm();
          this.hideForm = true;
        } else {
          this.toastr.error('Something went wrong!', 'Oops!');
        }
      });
    } else {
      const updateData = Object.assign(this.task, data);
      this._servicesService.updateTask(updateData).subscribe(response => {
        if (response.text === '200') {
          this.toastr.success('Task has been updated!', 'Success!');
          this.listTasks();
          this.resetForm();
          this.hideForm = true;
        } else {
          this.toastr.error('Something went wrong!', 'Oops!');
        }
      });
    }
  }

  deleteTask(taskId: any) {
    Swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this task!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._servicesService.deleteTask(taskId).subscribe(response => {
          if (response.text === '200') {
            Swal(
              'Deleted!',
              'Task has been deleted.',
              'success'
            );
            this.listTasks();
          } else {
            this.toastr.error('Something went wrong!', 'Oops!');
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'Cancelled',
          'Your task is safe :)',
          'error'
        );
      }
    });
  }

  editTask(taskId: any) {
    this.hideForm = false;
    this._servicesService.getTask(taskId).subscribe(response => {
      if (response.text === '200') {
        this.taskId = response.data.id;
        this.task = response.data;
        this.taskForm.patchValue({
          taskName: response.data.taskName,
          description: response.data.description,
          cost: response.data.cost,
          durationHours: response.data.durationHours,
          durationMinutes: response.data.durationMinutes,
        });
        this.taskName.nativeElement.focus();
      }
    });
  }
}
