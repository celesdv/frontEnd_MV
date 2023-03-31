import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCannedComponent } from './form-canned.component';

describe('FormCannedComponent', () => {
  let component: FormCannedComponent;
  let fixture: ComponentFixture<FormCannedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCannedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCannedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
