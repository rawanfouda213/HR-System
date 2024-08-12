import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePrintComponent } from './employee-print.component';

describe('EmployeePrintComponent', () => {
  let component: EmployeePrintComponent;
  let fixture: ComponentFixture<EmployeePrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePrintComponent]
    });
    fixture = TestBed.createComponent(EmployeePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
