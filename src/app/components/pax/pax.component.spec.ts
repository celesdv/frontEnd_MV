import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaxComponent } from './pax.component';

describe('PaxComponent', () => {
  let component: PaxComponent;
  let fixture: ComponentFixture<PaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
