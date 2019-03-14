/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FooterTemplateComponent } from './footer-template.component';

describe('FooterTemplateComponent', () => {
  let component: FooterTemplateComponent;
  let fixture: ComponentFixture<FooterTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
