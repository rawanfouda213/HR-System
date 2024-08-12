// import { Component } from '@angular/core';
// import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { MatDialogRef } from '@angular/material/dialog';
// import { Router } from '@angular/router';
// import { AttendanceModel } from 'src/app/Model/attendance-model';
// import { AttendanceService } from 'src/app/Services/attendance.service';

// @Component({
//   selector: 'app-add-attendance-popup',
//   templateUrl: './add-attendance-popup.component.html',
//   styleUrls: ['./add-attendance-popup.component.css']
// })
// export class AddAttendancePopupComponent {

//   employeesDropdown: any;

//   AttendanceForm!: FormGroup ;
//   empId: number | null = null;
//   // empId=new FormControl('', [Validators.required]);
//   attend=new FormControl(null, [Validators.required]);
//   leave=new FormControl(null, [Validators.required]);
//   day=new FormControl(null, [Validators.required]);

//   constructor(private dialogRef: MatDialogRef<AddAttendancePopupComponent>, private Service: AttendanceService, private fb: FormBuilder, private router: Router){
//     this.loadEmployeesDropDown();
//     this.AttendanceForm = this.fb.group({
//       empId: [this.empId, Validators.required],
//       attend:this.attend ,
//       leave:this.leave ,
//       day: this.day
//     });
//   }

//   loadEmployeesDropDown() {
//     this.Service.getAllEmployees().subscribe(employeesDropdown => {
//       this.employeesDropdown = employeesDropdown;
//     });
//   }

//   save() {
//     console.log(this.AttendanceForm.value);
//     const attendanceModel: AttendanceModel = {
//       empId: this.empId,
//       attend: this.AttendanceForm.value.attend!,
//       leave: this.AttendanceForm.value.leave!,
//       day: this.AttendanceForm.value.day!,

//     };
//       this.Service
//         .addEmployeeAttendance(attendanceModel)
//         .subscribe(() => {
//           console.log('success');
//           this.router.navigateByUrl('/Attendances');
//         });
//   }

//   onClose(): void {
//     this.dialogRef.close();
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AttendanceService } from 'src/app/Services/attendance.service';

@Component({
  selector: 'app-add-attendance-popup',
  templateUrl: './add-attendance-popup.component.html',
  styleUrls: ['./add-attendance-popup.component.css']
})
export class AddAttendancePopupComponent implements OnInit {
  attendanceForm!: FormGroup;
  employees: any[]=[];

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddAttendancePopupComponent>,private apiService: AttendanceService, private router: Router, private toast: NgToastService) { }

  ngOnInit(): void {
    this.attendanceForm = this.fb.group({
      employeeId: ['', Validators.required],
      // attendance: ['', Validators.required],
      // departure: ['', Validators.required]
      // date: [null, Validators.required],
      attendanceDate: ['', Validators.required],
      attendanceTime: ['', Validators.required],
      // departureTime: ['', Validators.required]
    });

    // Fetch employees data
    this.apiService.getAllEmployees().subscribe((data: any[]) => {
      this.employees = data;
    });
  }

  // onSubmit(): void {
  //   if (this.attendanceForm.valid) {
  //     const employeeId = this.attendanceForm.value.employeeId;
  //     const attendance = this.attendanceForm.value.attendance;
  //     const departure = this.attendanceForm.value.departure;
  
  //     this.apiService.addAttendance(employeeId, attendance, departure).subscribe(
  //       (response) => {
  //         console.log('Attendance added successfully');
  //         // Reset the form after successful submission
  //         this.attendanceForm.reset();
  //       },
  //       (error) => {
  //         console.error('Error adding attendance:', error);
  //         if (error.error && error.error.message) {
  //           // Handle error message from the server
  //           console.error('Server error:', error.error.message);
  //         } else {
  //           // Handle other types of errors
  //           console.error('Unknown error occurred.');
  //         }
  //       }
  //     );
  //   }
  // }

  onSubmit(): void {
    if (this.attendanceForm.valid) {
      const employeeId = this.attendanceForm.value.employeeId;
      const attendanceDate = this.attendanceForm.value.attendanceDate;
      const attendanceTime = this.attendanceForm.value.attendanceTime;
      // const departureTime = this.attendanceForm.value.departureTime;
  
      // حصول التوقيت الزمني للمستخدم
      const userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
  
      // تحويل الوقت إلى توقيت UTC باستخدام التوقيت الزمني للمستخدم
      const attendanceDateTime = new Date(new Date(`${attendanceDate}T${attendanceTime}`).getTime() - userTimezoneOffset);
      // const departureDateTime = departureTime ? new Date(new Date(`${attendanceDate}T${departureTime}`).getTime() - userTimezoneOffset) : undefined;
  
      this.apiService.addAttendance(employeeId, attendanceDateTime).subscribe(
        (response) => {
          console.log('Attendance added successfully');
          this.toast.success({
            detail: 'نجاح',
            summary: 'تم إضافة وقت الحضور بنجاح',
            duration: 5000,
          });
          // إعادة تعيين النموذج بعد التقديم الناجح
          this.attendanceForm.reset();
          // this.router.navigateByUrl('/Attendance')
          this.dialogRef.close();
        },
        (error) => {
          console.error('Error adding attendance:', error);
          this.dialogRef.close();
        }
      );
    }
  }

  OnClose():void{
    this.dialogRef.close();
  }

}

