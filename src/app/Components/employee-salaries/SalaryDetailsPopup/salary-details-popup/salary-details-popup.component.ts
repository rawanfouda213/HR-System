import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeSalariesService } from 'src/app/Services/employee-salaries.service';

@Component({
  selector: 'app-salary-details-popup',
  templateUrl: './salary-details-popup.component.html',
  styleUrls: ['./salary-details-popup.component.css']
})
export class SalaryDetailsPopupComponent implements OnInit {

  employeeDetails: any;

  displayedColumns: string[] = ["name", "department", "attend", "leave", "date", "OriginalAttend", "OriginalLeave", "ExtraHours", "EarlyDepartureHours"];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<SalaryDetailsPopupComponent>, private salaryService: EmployeeSalariesService ) {
    this.employeeDetails = data.employeeDetails;
  }

  ngOnInit(): void {
    if (this.data && this.data.employeeId && this.data.month && this.data.year) {
      this.salaryService.getEmployeeDetails(this.data.employeeId, this.data.month, this.data.year).subscribe(
        (data: any[]) => {
          this.employeeDetails = data;
        },
        error => {
          console.error('Error fetching employee details:', error);
        }
      );
    } else {
      console.error('Invalid data passed to DetailsDialogComponent.');
    }
  }

  convertToPositiveNumber(number: number): number {
    return Math.abs(number);
  }

  onClose(): void {
    this.dialogRef.close();
  }


  // printAll(): void {
  //   // Fetch all employee data from the backend
  //   this.salaryService.getEmployeeDetails(this.data.employeeId, this.data.month, this.data.year).subscribe(
  //     (employees: any[]) => {
  //       // Create a new window to print all employees' details
  //       const printWindow = window.open();
  
  //       // Check if the window was successfully opened
  //       if (printWindow) {
  //         // Build the content to be printed
  //         let contentToPrint = `
  //           <html>
  //             <head>
  //               <style>
  //                 table {
  //                   border-collapse: collapse;
  //                   width: 100%;
  //                 }
  
  //                 th, td {
  //                   border: 1px solid black;
  //                   padding: 8px;
  //                   text-align: center;
  //                 }
  //                 h1{
  //                   text-align: center;
  //                 }
  //               </style>
  //             </head>
  //             <body>
  //               <h1>Employees Details</h1>
  //               <table dir="rtl">
  //                 <tr>
  //                   <th>اسم الموظف</th>
  //                   <th>القسم</th>
  //                   <th>موعد الحضور اليومي</th>
  //                   <th>موعد الانصراف اليومي</th>
  //                   <th>التاريخ</th>
  //                   <th>موعد الحضور</th>
  //                   <th>موعد الانصراف</th>
  //                   <th>الساعات الإضافية</th>
  //                   <th>ساعات المغادرة المبكرة</th>
  //                   <th>الشهر/ السنة</th>
  //                 </tr>`;
  
  //         // Loop through each employee and add a row to the content
  //         employees.forEach(employee => {
  //           contentToPrint += `
  //             <tr>
  //               <td>${employee.name}</td>
  //               <td>${employee.department}</td>
  //               <td>${employee.attend}</td>
  //               <td>${employee.leave}</td>
  //               <td>${employee.date}</td>
  //               <td>${employee.originalAttend}</td>
  //               <td>${employee.originalLeave}</td>
  //               <td>${employee.extraHours}</td>
  //               <td>${this.convertToPositiveNumber(employee.earlyDepartureHours)}</td>
  //               <td>${employee.month+ "/"+ employee.year}</td>
  //             </tr>`;
  //         });
  
  //         // Close the table and body tags
  //         contentToPrint += `
  //               </table>
  //             </body>
  //           </html>`;
  
  //         // Write the content to the new window
  //         printWindow.document.open();
  //         printWindow.document.write(contentToPrint);
  //         printWindow.document.close();
  
  //         // Trigger the print dialog
  //         printWindow.print();
  //         printWindow.onafterprint = () => {
  //           // Close the print window after printing
  //           printWindow.close();
  //         };
  //       } else {
  //         console.error('Failed to open the print window');
  //       }
  //     },
  //     error => {
  //       console.error('Failed to fetch employee data:', error);
  //     }
  //   );
  // }


  printEmployeeDetails(): void {
    let printContents = '<h2 style="text-align:center">تفاصيل حضور الموظفين</h2><table><thead><tr><th>اسم الموظف</th><th>القسم</th><th>موعد الحضور اليومي</th><th>موعد الانصراف اليومي</th><th>التاريخ</th><th>موعد الحضور</th><th>موعد الانصراف</th><th>الساعات الإضافية</th><th>ساعات المغادرة المبكرة</th></tr></thead><tbody>';
  
    for (const employee of this.employeeDetails) {
      printContents += `<tr><td>${employee.name}</td><td>${employee.department}</td><td>${employee.attend}</td><td>${employee.leave}</td><td>${employee.date}</td><td>${employee.originalAttend}</td><td>${employee.originalLeave}</td><td>${employee.extraHours}</td><td>${employee.earlyDepartureHours}</td></tr>`;
    }
  
    printContents += '</tbody></table>';
  
    let popupWin = window.open('', '_blank', 'width=600,height=600');
    popupWin?.document.open();
    popupWin?.document.write(`
      <html dir=rtl>
        <head>
          <title>Print tab</title>
          <style>
            table { border-collapse: collapse; width: 100%; dir:rtl; }
            th, td { border: 1px solid black; padding: 8px; text-align: center; dir:rtl; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body onload="window.print();">${printContents}</body>
      </html>`
    );
    popupWin?.document.close();
  }


}
