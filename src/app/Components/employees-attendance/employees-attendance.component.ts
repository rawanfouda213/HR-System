import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AttendanceService } from 'src/app/Services/attendance.service';
import { Employee } from 'src/app/Model/employee';
import { RoleResponse } from 'src/app/Model/role-response';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { AddAttendancePopupComponent } from './Popup Attendance/add-attendance-popup/add-attendance-popup.component';
import { NgToastService } from 'ng-angular-popup';
import { EditAttendancePopupComponent } from './Popup Attendance/edit-attendance-popup/edit-attendance-popup.component';
import { ConfirmPopupComponent, ConfirmationDialogData } from '../confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-employees-attendance',
  templateUrl: './employees-attendance.component.html',
  styleUrls: ['./employees-attendance.component.css']
})
export class EmployeesAttendanceComponent implements OnInit {
  dataSource: any;
  employees: any;
  selectedEmployee: Employee | undefined;
  editingRow: any = null;
  editedAttendance: any = {};
  employeeIndex: number = 0;

  filteredDataSource: any[] = [];
  
  @ViewChild('input') input!: ElementRef;
  displayedColumns: string[] = ["name", "department", "attend", "leave","day", "action"];
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  startDate: string = '';
  endDate: string = '';
  
  constructor(private dialog: MatDialog, private router: Router, private Service: AttendanceService, private authService: AuthServiceService, private toast: NgToastService ) {}

  ngOnInit(): void {
    this.getListOfPermission();
    this.loadEmployees();
  }


  loadEmployees() {
    this.Service.getAllEmployeeAttendance().subscribe((data) => {
      console.log(data);
      this.employees = data;
      this.dataSource = new MatTableDataSource<EmployeesAttendanceComponent>(this.employees);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onShowAttendance() {
    if (this.startDate && this.endDate) {
      this.Service.getEmployeeAttendanceBetweenDates(this.startDate, this.endDate).subscribe((data) => {
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    } else {
      this.dataSource = new MatTableDataSource<any>([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    }
  }

  pageName: string = 'attendance';
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


  Filterchange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  print(): void {
    this.Service.getAllEmployeeAttendance().subscribe(
      (employees: any[]) => {
        const printWindow = window.open();
  
        if (printWindow) {
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
                <h1>تفاصيل حضور و انصراف الموظفين</h1>
                <table dir="rtl">
                  <tr>
                    <th>اسم الموظف</th>
                    <th>القسم</th>
                    <th>وقت الحضور</th>
                    <th>وقت الانصراف</th>
                    <th>التاريخ</th>
                  </tr>`;
  
          employees.forEach(employee => {
            contentToPrint += `
              <tr>
                <td>${employee.name}</td>
                <td>${employee.department}</td>
                <td>${employee.attend}</td>
                <td>${employee.leave}</td>
                <td>${employee.day}</td>
              </tr>`;
          });
  
          contentToPrint += `
                </table>
              </body>
            </html>`;
  
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
      },
      error => {
        console.error('Failed to fetch employee data:', error);
      }
    );
  }

  exportToPDF(): void {
    const data: any[] = this.dataSource.data;
    const columns: any[] = [
      { title: 'ID', dataKey: 'id' },
      { title: 'Department', dataKey: 'department' },
      { title: 'Employee Name', dataKey: 'name' },
      { title: 'Attendance', dataKey: 'attend' },
      { title: 'Leave', dataKey: 'leave' },
      { title: 'Date', dataKey: 'date' }
    ];

    const doc = new jsPDF();

    doc.text('Report for Employees Attendance & Leave', 10, 10);
    (doc as any).autoTable({
      head: [columns.map(column => column.title)],
      body: data.map(item => columns.map(column => item[column.dataKey])),
      startY: 20
    });

    doc.save('table_data.pdf');
  }

  exportToExcel(): void {
    const data: any[] = this.dataSource.data;
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'table_data.xlsx');
  }

  AddNewAttendance(index: number): void {
    if (this.isAdd == true) {
      this.editedAttendance = { ...this.employees[index] };
      this.Openpopup(this.editedAttendance, 'Add Attendance', AddAttendancePopupComponent);
    } else {
      this.toast.error({
        detail: 'خطأ',
        summary: 'ليس لديك صلاحيات لإضافة الحضور',
        duration: 5000,
      });
    }
  }

  EditAttendance(index: number): void {
    if (this.isEdit == true) {
      const confirmDialogData: ConfirmationDialogData = {
        title: 'تأكيد التعديل',
        message: 'هل تريد تعديل الحضور و الانصراف؟'
      };
  
      const dialogRef = this.dialog.open(ConfirmPopupComponent, {
        width: '300px',
        data: confirmDialogData,
      });
  
      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
      this.OpenpopupEdit('Edit Attendance',EditAttendancePopupComponent,index);
    }
    else {
      console.log('Edit canceled');
    }
  });
 } else {
      this.toast.error({
        detail: 'خطأ',
        summary: 'ليس لديك صلاحيات لتعديل الحضور',
        duration: 5000,
      });
    }
  }

  OpenpopupEdit(title: any, component: any, attendanceId: number) {
    const dialogRef = this.dialog.open(component, {
      width: '40%',
      // enterAnimationDuration: '1000ms',
      // exitAnimationDuration: '700ms',
      data: {
        title: title,
        attendanceId: attendanceId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadEmployees();
    });
  }
  


  Openpopup(data: any, title: any, component: any) {
    const dialogRef = this.dialog.open(component, {
      width: '40%',
      // enterAnimationDuration: '1000ms',
      // exitAnimationDuration: '700ms',
      data: {
        title: title,
        holidayData: data,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadEmployees();
    });
  }


  deleteEmployeeAttendance(id: number): void {
    if (this.isDelete == true) {

      const confirmDialogData: ConfirmationDialogData = {
        title: 'تأكيد الحذف',
        message: 'هل تريد حذف الحضور و الانصراف؟'
      };
  
      const dialogRef = this.dialog.open(ConfirmPopupComponent, {
        width: '300px',
        data: confirmDialogData,
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
    this.Service.deleteEmployeeAttendance(id).subscribe((response) => {
        console.log('Attendance deleted successfully.');
        this.toast.success({detail: 'تم', summary: 'تم الحذف بنجاح',duration: 5000,});
        this.loadEmployees();
      },
      (error) => {
        // Handle error
        console.error('Failed to delete attendance:', error);
        this.toast.error({detail: 'خطأ', summary: 'يوجد خطأ في حذف الحضور و الانصراف',duration: 5000,});
      }
    );
  }
    else {
      console.log('delete canceled');
    }
  });
    }
    else {
      this.toast.error({
        detail: 'خطأ',
        summary: 'ليس لديك صلاحيات لحذف الحضور و الانصراف ',
        duration: 5000,
      });
    }
  }
  
}

