import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryDetailsPopupComponent } from './salary-details-popup.component';

describe('SalaryDetailsPopupComponent', () => {
  let component: SalaryDetailsPopupComponent;
  let fixture: ComponentFixture<SalaryDetailsPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalaryDetailsPopupComponent]
    });
    fixture = TestBed.createComponent(SalaryDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
