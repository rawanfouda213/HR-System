import { MatTableDataSource } from '@angular/material/table';
import { EmployeeSalariesService } from './../../Services/employee-salaries.service';
import { Component, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Customer } from 'src/app/Model/Customer';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import  jsPDF from 'jspdf';
import 'jspdf-autotable';
import { NgToastService } from 'ng-angular-popup';
import { SalaryDetailsPopupComponent } from './SalaryDetailsPopup/salary-details-popup/salary-details-popup.component';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { RoleResponse } from 'src/app/Model/role-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-salaries',
  templateUrl: './employee-salaries.component.html',
  styleUrls: ['./employee-salaries.component.css']
})
export class EmployeeSalariesComponent implements OnInit, OnDestroy {

  months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  // years: number[] = [2008,2009,2010,2011,2022, 2023, 2024];

  
  customerlist !: Customer[];
  dataSource: any;
  displayedColumns: string[] = ["name", "department", "BasicSalary", "DaysOfAttendance", "DaysOfAbsence", "AdditionalHours", "DiscountHours", "AdditionalTotal", "TotalDiscount", "NetSalary" ,"action"];
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  selectedMonth: number | undefined;
  selectedYear: number | undefined;


  salaries: any[] = [];
  private intervalId?:number;

  constructor(private salaryService: EmployeeSalariesService ,private dialog: MatDialog, private toast: NgToastService, private authService: AuthServiceService, private router: Router) {
  }

  ngOnInit(): void {
    this.getListOfPermission();
    this.salaryService.getAllSalaries().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  pageName: string = 'Salaries';
  isAdd: boolean = false;
  isEdit: boolean = false;
  isDelete: boolean = false;
  roleResponse!: RoleResponse;
  getListOfPermission() {
    this.roleResponse = this.authService.getRole()!;
    const RolePermissions = this.roleResponse.rolePermissionsDTOs?.find(
      (h) => h.page_Name == this.pageName
    );
    console.log(RolePermissions);
    if(RolePermissions){
      this.isAdd = RolePermissions?.isAdd!;
      this.isEdit = RolePermissions?.isEdit!;
      this.isDelete = RolePermissions?.isDelete!;
      } else {
        this.router.navigate(['/404']);
      }
  }

  ngOnDestroy(): void {
      if(this.intervalId){
        clearInterval(this.intervalId);
      }
  }

  currentYear = new Date().getFullYear();
  years = Array.from({ length: 17 }, (_, index) => this.currentYear - index);

  convertToPositiveNumber(number: number): number {
    return Math.abs(number);
  }

  Filterchange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }


  openDetailsPopup(employeeId: any): void {
    if (this.selectedMonth !== undefined && this.selectedYear !== undefined) {
      this.salaryService.getEmployeeDetails(employeeId, this.selectedMonth, this.selectedYear).subscribe(
        (data: any[]) => {
          if (data && data.length > 0) {
            const dialogRef = this.dialog.open(SalaryDetailsPopupComponent, {
              width: '100%',
              enterAnimationDuration: '1000ms',
              exitAnimationDuration: '1000ms',
              data: { employeeDetails: data }
            });
  
            dialogRef.afterClosed().subscribe(result => {
              console.log('Dialog closed with result:', result);
            });
          } else {
            this.toast.error({detail: "خطأ", summary: "لم يتم العثور على تفاصيل الحضور للموظف المحدد.", duration: 5000, position:'topCenter'});
            console.log('No attendance details found for the selected employee.');
          }
        },
        error => {
          this.toast.error({detail: "خطأ", summary: "فشل في عرض تفاصيل الحضور.", duration: 5000, position:'topCenter'});
          console.error('Error fetching attendance details:', error);
        }
      );
    } else {
      this.toast.error({detail: "خطأ", summary: 'ينبغي اختيار كل من الشهر والسنة.', duration: 5000, position:'topCenter'});
      console.log('Both month and year should be selected.');
    }
  }

  showDetails(employee: any): void {
    const dialogRef = this.dialog.open(SalaryDetailsPopupComponent, {
      width: '300px',
      data: {
        employeeId: employee.id,
        selectedMonth: this.selectedMonth,
        selectedYear: this.selectedYear
      }
    });

    dialogRef.afterClosed().subscribe(item => {
    });
  }

  selectedEmployee: any;


  print(employee: any): void {
    const printWindow = window.open();
  
    if (printWindow) {
const contentToPrint = `
  <html>
    <head>
      <style>
        table {
          border-collapse: collapse;
          width: 100%;
        }

        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: center;
        }
        h1{
          text-align: center;
        }
      </style>
    </head>
    <body>
      <h1>تفاصيل الموظف : ${employee.empName}</h1>
      <table dir="rtl">
        <tr>
          <th>اسم الموظف</th>
          <th>القسم</th>
          <th>الراتب الأساسي</th>
          <th>عدد أيام الحضور</th>
          <th>عدد أيام الغياب</th>
          <th>الاضافي بالساعات</th>
          <th>الخصم بالساعات</th>
          <th>اجمالي الاضافي</th>
          <th>اجمالي الخصم</th>
          <th>الصافي</th>

        </tr>
        <tr>
          <td>${employee.empName}</td>
          <td>${employee.deptName}</td>
          <td>${employee.netSalary}</td>
          <td>${employee.attendanceDays}</td>
          <td>${employee.absenceDaysToDate}</td>
          <td>${employee.exrtaHours}</td>
          <td>${this.convertToPositiveNumber(employee.discountHours)}</td>
          <td>${employee.extraSalary}</td>
          <td>${this.convertToPositiveNumber(employee.discountSalary)}</td>
          <td>${employee.totalSalary}</td>
        </tr>
      </table>
    </body>
  </html>
`;
      printWindow.document.open();
      printWindow.document.write(contentToPrint);
      printWindow.document.close();
  
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    } else {
      console.error('Failed to open the print window');
    }
  }


  printAll(): void {
    // Fetch all employee data from the backend
    this.salaryService.getAllSalaries().subscribe(
      (employees: any[]) => {
        // Create a new window to print all employees' details
        const printWindow = window.open();
  
        // Check if the window was successfully opened
        if (printWindow) {
          // Build the content to be printed
          let contentToPrint = `
            <html>
              <head>
                <style>
                  table {
                    border-collapse: collapse;
                    width: 100%;
                  }
  
                  th, td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: center;
                  }
                  h1{
                    text-align: center;
                  }
                </style>
              </head>
              <body>
                <h1>Employees Details</h1>
                <table dir="rtl">
                  <tr>
                    <th>اسم الموظف</th>
                    <th>القسم</th>
                    <th>الراتب الأساسي</th>
                    <th>عدد أيام الحضور</th>
                    <th>عدد أيام الغياب</th>
                    <th>الاضافي بالساعات</th>
                    <th>الخصم بالساعات</th>
                    <th>اجمالي الاضافي</th>
                    <th>اجمالي الخصم</th>
                    <th>الصافي</th>
                    <th>الشهر/ السنة</th>

                  </tr>`;
  
          // Loop through each employee and add a row to the content
          employees.forEach(employee => {
            contentToPrint += `
              <tr>
                <td>${employee.empName}</td>
                <td>${employee.deptName}</td>
                <td>${employee.netSalary}</td>
                <td>${employee.attendanceDays}</td>
                <td>${employee.absenceDaysToDate}</td>
                <td>${employee.exrtaHours}</td>
                <td>${this.convertToPositiveNumber(employee.discountHours)}</td>
                <td>${employee.extraSalary}</td>
                <td>${this.convertToPositiveNumber(employee.discountSalary)}</td>
                <td>${employee.totalSalary}</td>
                <td>${employee.month+ "/"+ employee.year}</td>
              </tr>`;
          });
  
          // Close the table and body tags
          contentToPrint += `
                </table>
              </body>
            </html>`;
  
          // Write the content to the new window
          printWindow.document.open();
          printWindow.document.write(contentToPrint);
          printWindow.document.close();
  
          // Trigger the print dialog
          printWindow.print();
          printWindow.onafterprint = () => {
            // Close the print window after printing
            printWindow.close();
          };
        } else {
          console.error('Failed to open the print window');
        }
      },
      error => {
        console.error('Failed to fetch employee data:', error);
      }
    );
  }

  exportToExcel(): void {
    const data: any[] = this.dataSource.data;
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'table_data.xlsx');
  }
  
searchEmployee() {
  if (this.selectedMonth !== undefined && this.selectedYear !== undefined) {
    this.salaryService.getSalariesByMonthAndYear(this.selectedMonth, this.selectedYear).subscribe(data => {
      if (data && data.length > 0) {
        this.salaries = data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      } else {
        this.toast.error({detail: "خطأ", summary: "لم يتم العثور على بيانات للشهر والسنة المحددة", duration: 5000, position:'topCenter'});
        console.log('No data found for the selected month and year.');
      }
    }, error => {
      this.toast.error({detail: "خطأ", summary: "لم يتم العثور على بيانات للشهر والسنة المحددة", duration: 5000, position:'topCenter'});
      console.error('Error fetching data:', error);
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    });
  } else {
    this.toast.error({detail: "خطأ", summary: 'ينبغي اختيار كل من الشهر و السنة', duration: 5000, position:'topCenter'});
    console.log('Both month and year should be selected.');
  }
}
  

}
