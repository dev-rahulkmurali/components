/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddFooterTemplateComponent } from './add-footer-template.component';

describe('AddFooterTemplateComponent', () => {
  let component: AddFooterTemplateComponent;
  let fixture: ComponentFixture<AddFooterTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFooterTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFooterTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
