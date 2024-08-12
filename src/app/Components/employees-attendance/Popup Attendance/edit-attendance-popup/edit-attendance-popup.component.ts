// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { AttendanceService } from 'src/app/Services/attendance.service';

// @Component({
//   selector: 'app-edit-attendance-popup',
//   templateUrl: './edit-attendance-popup.component.html',
//   styleUrls: ['./edit-attendance-popup.component.css']
// })
// export class EditAttendancePopupComponent {


//   editAttendanceForm!: FormGroup;
//   employees: any[]=[];
//   attendanceId: number | undefined;


//   constructor(private fb: FormBuilder, private apiService: AttendanceService, private router: Router, private route: ActivatedRoute,) { }

//   // ngOnInit(): void {
//   //   this.editAttendanceForm = this.fb.group({
//   //     employeeId: ['', Validators.required],
//   //     // attendance: ['', Validators.required],
//   //     // departure: ['', Validators.required]
//   //     // date: [null, Validators.required],
//   //     attendanceDate: ['', Validators.required],
//   //     attendanceTime: ['', Validators.required],
//   //     departureTime: ['', Validators.required]
//   //   });

//   //   // Fetch employees data
//   //   this.apiService.getAllEmployees().subscribe((data: any[]) => {
//   //     this.employees = data;
//   //   });
//   // }

//   ngOnInit(): void {
//     this.editAttendanceForm = this.fb.group({
//       attendanceDate: ['', Validators.required],
//       attendanceTime: ['', Validators.required],
//       departureTime: ['', Validators.required]
//     });
//   }




//   // onSubmit(): void {
//   //   if (this.editAttendanceForm.valid) {
//   //     const attendanceId = /* get the attendance id */;
//   //     const attendanceDate = this.editAttendanceForm.value.attendanceDate;
//   //     const attendanceTime = this.editAttendanceForm.value.attendanceTime;
//   //     const departureTime = this.editAttendanceForm.value.departureTime;

//   //     const attendance = new Date(`${attendanceDate}T${attendanceTime}`);
//   //     const departure = new Date(`${attendanceDate}T${departureTime}`);

//   //     this.apiService.editEmployeeAttendance(attendanceId, attendance, departure).subscribe(
//   //       () => {
//   //         console.log('Attendance updated successfully');
//   //         // Optionally, you can navigate to another page or show a success message here
//   //       },
//   //       (error) => {
//   //         console.error('Error updating attendance:', error);
//   //         // Handle error
//   //       }
//   //     );
//   //   }
//   // }

// }






// import { Component, Inject, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { Router } from '@angular/router';
// import { AttendanceService } from 'src/app/Services/attendance.service';

// @Component({
//   selector: 'app-edit-attendance-popup',
//   templateUrl: './edit-attendance-popup.component.html',
//   styleUrls: ['./edit-attendance-popup.component.css']
// })
// export class EditAttendancePopupComponent implements OnInit {
//   attendanceForm!: FormGroup;
//   employees: any[] = [];
//   attendanceId: number | null = null; // Variable to hold the ID of the attendance being edited

//   constructor(private fb: FormBuilder, private apiService: AttendanceService, private router: Router, @Inject(MAT_DIALOG_DATA) private data: any, private dialogRef: MatDialogRef<EditAttendancePopupComponent>) {
//     this.attendanceId = data.attendanceId;
//    }

//   ngOnInit(): void {
//     this.attendanceForm = this.fb.group({
//       // employeeId: ['', Validators.required],
//       attendanceDate: ['', Validators.required],
//       attendanceTime: ['', Validators.required],
//       departureTime: ['', Validators.required]
//     });

//     // Fetch employees data
//     this.apiService.getAllEmployees().subscribe((data: any[]) => {
//       this.employees = data;
//     });

//     // Check if there's an attendance ID passed for editing
//     const attendanceData = history.state.data;
//     if (attendanceData) {
//       this.attendanceId = attendanceData.id;
//       // Populate form fields with existing attendance data
//       this.attendanceForm.patchValue({
//         employeeId: attendanceData.employeeId,
//         attendanceDate: new Date(attendanceData.attendance).toISOString().slice(0, 10),
//         attendanceTime: new Date(attendanceData.attendance).toISOString().slice(11, 16),
//         departureTime: new Date(attendanceData.departure).toISOString().slice(11, 16)
//       });
//     }


//   }

//   onSubmit(): void {
//     if (this.attendanceForm.valid) {
//       const attendanceDate = this.attendanceForm.value.attendanceDate;
//       const attendanceTime = this.attendanceForm.value.attendanceTime;
//       const departureTime = this.attendanceForm.value.departureTime;

//       const userTimezoneOffset = new Date().getTimezoneOffset() * 60000;

//       const attendanceDateTime = new Date(new Date(`${attendanceDate}T${attendanceTime}`).getTime() - userTimezoneOffset);
//       const departureDateTime = new Date(new Date(`${attendanceDate}T${departureTime}`).getTime() - userTimezoneOffset);

//       this.apiService.editAttendance(this.attendanceId!, attendanceDateTime, departureDateTime).subscribe(
//         (response) => {
//           console.log('Attendance edited successfully');
//           this.dialogRef.close();
//         },
//         (error) => {
//           console.error('Error editing attendance:', error);
//           // Handle error as needed
//         }
//       );
//     }
//   }

//   onClose(): void {
//     this.dialogRef.close();
//   }

// }




import { formatDate } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { AttendanceModel } from 'src/app/Model/attendance-model';
import { AttendanceService } from 'src/app/Services/attendance.service';


@Component({
  selector: 'app-edit-attendance-popup',
  templateUrl: './edit-attendance-popup.component.html',
  styleUrls: ['./edit-attendance-popup.component.css']
})
export class EditAttendancePopupComponent {
  attendanceForm!: FormGroup;
  employees: any[] = [];
  attendanceId: number | null = null;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<EditAttendancePopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private apiService: AttendanceService, private toast: NgToastService) {
    this.attendanceId = data.attendanceId;
    this.fetchDate();
  }


  ngOnInit(): void {}

  fetchDate() {
    this.attendanceForm = this.fb.group({
      id: [this.attendanceId, Validators.required],
      // attendanceDate: ['', Validators.required],
      attendanceTime: ['', Validators.required],
      departureTime: ['', Validators.required],
    });

    this.getAttendanceById();

    // Fetch employees data
    this.apiService.getAllEmployees().subscribe((data: any[]) => {
      this.employees = data;
    });
  }

  getAttendanceById() {
    this.apiService.getAttendanceById(this.attendanceId).subscribe({
      next: (value) => {
        // Check if there's an attendance ID passed for editing
        const attendanceData = value;
        console.log('asdasdasdasdassdas');
        console.log(attendanceData);
        const formattedAttendance = formatDate(
          attendanceData.attendence,
          'yyyy-MM-ddTHH:mm',
          'en'
        );
        const formattedDeparture = formatDate(
          attendanceData.departure,
          'yyyy-MM-ddTHH:mm',
          'en'
        );

        if (attendanceData) {
          this.attendanceId = attendanceData.id;
          // Populate form fields with existing attendance data
          this.attendanceForm.patchValue({
            id: attendanceData.id,
            //    attendanceDate: new Date(attendanceData.attendance),
            attendanceTime: formattedAttendance,
            departureTime: formattedDeparture,
          });

          console.log(attendanceData);
          console.log(this.attendanceForm.value);
        }
      },
    });
  }


  onSubmit(): void {
    if (this.attendanceForm.valid) {
      // const attendanceDate = this.attendanceForm.value.attendanceDate;
      const attendanceTime = this.attendanceForm.value.attendanceTime;
      const departureTime = this.attendanceForm.value.departureTime;

      const userTimezoneOffset = new Date().getTimezoneOffset() * 60000;

      // const attendanceDateTime = new Date(
      //   new Date(`${attendanceDate}T${attendanceTime}`).getTime() -
      //     userTimezoneOffset
      // );
      // const departureDateTime = new Date(
      //   new Date(`${attendanceDate}T${departureTime}`).getTime() -
      //     userTimezoneOffset
      // );

      this.apiService
        .editAttendance(this.attendanceId!, attendanceTime, departureTime)
        .subscribe(
          (response) => {
            console.log('Attendance edited successfully');
            this.toast.success({
              detail: 'نجاح',
              summary: 'تم تعديل الحضور والانصراف بنجاح',
              duration: 5000,
            });
            this.dialogRef.close();
          },
          (error) => {
            console.error('Error editing attendance:', error);
            this.dialogRef.close();
          }
        );
    }
  }

  OnClose(): void {
    this.dialogRef.close();
  }

}
