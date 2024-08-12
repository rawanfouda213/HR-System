import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { HolidayDto } from 'src/app/Model/holiday-dto';
import { HolidayServiceService } from 'src/app/Services/holiday-service.service';

@Component({
  selector: 'app-popup-holiday',
  templateUrl: './popup-holiday.component.html',
  styleUrls: ['./popup-holiday.component.css'],
})
export class PopupHolidayComponent implements OnInit {
  myform!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PopupHolidayComponent>,
    private holidayService: HolidayServiceService,
    private toast: NgToastService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    this.myform = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      date: [this.formatDateForInput(new Date()), Validators.required],
    });

    this.setpopupdata(this.data.holidayData);
  }

  setpopupdata(data: any) {
    console.log(data);

    if (data) {
      this.myform.patchValue({
        id: data.id,
        name: data.name || '',
        date: data.date || '',
      });
    }
  }
  get ID() {
    return this.myform.get('id');
  }
  get Name() {
    return this.myform.get('name');
  }
  get Date() {
    return this.myform.get('date');
  }
  formatDateForInput(date: Date): string {
    return formatDate(date, 'MM/dd/yyyy', 'en');
  }
  saveRequet: HolidayDto = {
    id: 0,
    name: '',
    date: new Date(),
  };
  saveChanges() {
    if (this.myform.valid) {
      this.saveRequet = {
        id: this.ID?.value,
        name: this.Name?.value,
        date: this.Date?.value,
      };
      console.log(this.saveRequet);
      this.holidayService.editHoliday(this.saveRequet).subscribe({
        next: (value) => {
          this.toast.success({
            detail: 'نجاح',
            summary: 'تم الحفظ بنجاح',
            duration: 990,
          });
            this.dialogRef.close();
        },
      });
    } else {
      this.toast.error({
        detail: 'خطأ',
        summary: 'من فضلك ادخل بيانات صحيحة',
        duration: 990,
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
