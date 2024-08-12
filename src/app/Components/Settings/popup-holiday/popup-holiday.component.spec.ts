import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupHolidayComponent } from './popup-holiday.component';

describe('PopupHolidayComponent', () => {
  let component: PopupHolidayComponent;
  let fixture: ComponentFixture<PopupHolidayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupHolidayComponent]
    });
    fixture = TestBed.createComponent(PopupHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
