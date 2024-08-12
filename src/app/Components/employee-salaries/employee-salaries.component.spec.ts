import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalariesComponent } from './employee-salaries.component';

describe('EmployeeSalariesComponent', () => {
  let component: EmployeeSalariesComponent;
  let fixture: ComponentFixture<EmployeeSalariesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeSalariesComponent]
    });
    fixture = TestBed.createComponent(EmployeeSalariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
