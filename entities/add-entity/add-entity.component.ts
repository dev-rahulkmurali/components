import { AuthenticationService } from './../../../core/authentication/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { SettingsService } from './../../settings.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input, ElementRef, ViewChild } from '@angular/core';
import * as _ from 'lodash';
@Component({
  selector: 'app-add-entity',
  templateUrl: './add-entity.component.html',
  styleUrls: ['./add-entity.component.css']
})
export class AddEntityComponent implements OnInit {

  @Output() closeModal = new EventEmitter();
  @Output() refreshEmit = new EventEmitter();
  @Input() editEntity: any;
  @Input() editEntityIndex: any;
  @Input() title: any;
  @Input()
  set entitiesCount(count: number) {
    const enticount = count;
    this.showDefault = (enticount === 0 || enticount === 1 || !this.editEntity) ? false : true;
    this.entity.defaultEntity = (enticount === 0 || enticount === 1) ? true : false;
  }

  @ViewChild('cancelRef') cancelRef: ElementRef;
  showDefault: boolean;
  entity: any = {
    entityName: '',
    description: '',
    defaultEntity: '',
    gstEnabled: '',
    gstLabel: '',
    gstRegistrationNumber: '',
    gstValue: '',
    priceIncludeGst: '',
    smsSenderName: '',
    city: '',
    country: '',
    countryCode: '',
    address: {
      email: '',
      address1: '',
      address2: '',
      city: '',
      country: '',
      countryCode: '',
      district: '',
      mobileNumber: '',
      state: '',
      street: '',
      zipCode: '',
      phoneNumber: '',
      displayName: '',
      code: ''
    },
    image: {
      id: '',
      awsId: '',
      contentType: '',
      fileName: '',
      size: '',
      url: './assets/images/profile_pic.jpg',
      imageBase64: '',
      width: 0,
      height: 0
    },
    uploadImage: '',
  };
  countries: any;
  widthValue = 0;
  heightValue = 0;
  defaultImage = './assets/images/profile_pic.jpg';
  maxLength = 15;
  max = 6;
  sixDigits = '^[0-9]{6,6}$';
  phonePattern = '^[+][0-9]{8,12}$';
  lenPattern: string;
  entityDefault: any;

  constructor(private settingService: SettingsService, private toastr: ToastrService,
    private authService: AuthenticationService) {
  }

  ngOnInit() {
    if (this.editEntity) {
      this.entity = this.editEntity[this.editEntityIndex];
      this.entityDefault = this.entity.defaultEntity;
    }
    this.countryList();

    if (!this.editEntity) {
      this.entity.address.country = this.authService.credentials.principal.org.countryCode;
    }
  }

  countryList() {
    this.settingService.getCountries().subscribe(res => {
      this.countries = res;
    });
  }

  saveEntity(entityForm: NgForm) {
    if (this.editEntity) {
      this.updateEntity(this.editEntity);
    } else {
      this.settingService.saveEntity(this.entity).subscribe(response => {
        this.refreshEmit.emit({ 'entities': response });
        this.cancelRef.nativeElement.click();
        entityForm.form.reset();
      }, error => {
      }
      );
    }
  }

  updateEntity(data: any) {
    this.settingService.updateEntity(data).subscribe(res => {
      if (this.entity.defaultEntity === true) {
        this.setDefaultEntity(this.entity.defaultEntity, this.entity.id);
      } else {
        this.refreshEmit.emit({ 'entities': res.organizationEntities });
      }
      this.cancelRef.nativeElement.click();
    }, error => {
    }
    );
  }

  setImage(event: any) {
    const fileType = [event.fileType];
    const file = event.fileData;
    this.settingService.uploadS3(fileType).subscribe(response => {
      const res = response[0];
      this.entity.image = Object.assign(this.entity.image, res);
      this.entity.image.url = res.downloadURL;
      this.entity.uploadImage = null;
      this.settingService.uploadUrlS3(res.uploadURL, file).subscribe((resp: any) => {
      });
    });

  }

  setCountry() {
    this.entity.address.country = this.entity.address.country.displayName;
    this.entity.address.city = this.entity.address.country.displayName;
    this.entity.address.countryCode = this.entity.address.country.code;
    this.entity.country = this.entity.address.country.displayName;
    this.entity.city = this.entity.address.country.displayName;
    this.entity.countryCode = this.entity.address.country.code;
    if (this.entity.address.country === 'Singapore') {
      this.lenPattern = this.sixDigits;
    } else {
      this.lenPattern = '';
    }
  }

  setDefaultEntity(event: any, id: string) {
    if (event === true) {
      this.settingService.setDefaultEntity(id).subscribe((res: any) => {
        this.refreshEmit.emit({ 'entities': res });
      });
    }
  }

}


