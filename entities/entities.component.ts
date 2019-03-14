import { ToastrService } from 'ngx-toastr';
import { AddEntityComponent } from './add-entity/add-entity.component';
import { SettingsService } from './../settings.service';
import {
  Component, OnInit, ViewChild, ViewContainerRef, Renderer2, ComponentFactoryResolver,
  Input
} from '@angular/core';

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.css']
})
export class EntitiesComponent implements OnInit {

  entities: any;
  entity: any;
  @ViewChild('modalcontainer', { read: ViewContainerRef }) entry: ViewContainerRef;
  @Input() refreshEmit: any;

  constructor(private settingsSerivice: SettingsService,
    private renderer: Renderer2,
    private resolver: ComponentFactoryResolver,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.listEntities();
  }

  listEntities() {

    this.settingsSerivice.getEntities().subscribe(res => {
      this.entities = res;
    });
  }

  addEntity() {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(AddEntityComponent);
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.title = 'Add New Entity';
    componentRef.instance.entitiesCount = this.entities ? this.entities.length : 0;
    componentRef.instance.refreshEmit.subscribe((res: any) => {
      this.toastr.success('Entity  has been created!', 'Success!');
      this.entities.push(res.entities);
    });
  }

  editEntity(data: any, index: number) {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(AddEntityComponent);
    const componentEditRef = this.entry.createComponent(factory);
    componentEditRef.instance.editEntity = this.entities;
    componentEditRef.instance.editEntityIndex = index;
    componentEditRef.instance.title = 'Edit Entity';
    componentEditRef.instance.entitiesCount = this.entities ? this.entities.length : 0;
    componentEditRef.instance.refreshEmit.subscribe((res: any) => {
      this.toastr.success('Entity  has been edited!', 'Success!');
      this.entities = res.entities;

    });
  }


}
