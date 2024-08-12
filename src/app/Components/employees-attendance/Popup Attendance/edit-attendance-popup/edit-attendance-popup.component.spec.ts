import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAttendancePopupComponent } from './edit-attendance-popup.component';

describe('EditAttendancePopupComponent', () => {
  let component: EditAttendancePopupComponent;
  let fixture: ComponentFixture<EditAttendancePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAttendancePopupComponent]
    });
    fixture = TestBed.createComponent(EditAttendancePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
