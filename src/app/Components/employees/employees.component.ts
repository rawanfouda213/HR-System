import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AllEmployeesService } from 'src/app/Services/all-employees.service';
import { Employee } from 'src/app/Model/employee';
import { ConfirmPopupComponent, ConfirmationDialogData } from '../confirm-popup/confirm-popup.component';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { RoleResponse } from 'src/app/Model/role-response';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  dataSource: any;
  employees:any;
  @ViewChild('input') input!: ElementRef;
  displayedColumns: string[] = ["name", "Department","Salary", "Address", "PhoneNo", "Gender","Nationality","BirthDate", "NationalId","ContractDate","action"];
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(private dialog: MatDialog, private router: Router , private Service: AllEmployeesService, private authService: AuthServiceService, private toast: NgToastService) {
    this.loadEmployees();
  }
  loadEmployees() {
    this.Service.getEmployeeData().subscribe((data) => {
      console.log(data);
      this.employees = data;
      this.dataSource = new MatTableDataSource<Employee>(this.employees);
  
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnInit(): void {
    this.getListOfPermission();
  }

  pageName: string = 'Employees';
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

  applyFilter() {
    const filterValue = this.input.nativeElement.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearSearch() {
    this.input.nativeElement.value = '';
    this.applyFilter();
  }

  addEmployee() {
    if (this.isAdd == true) {
      this.router.navigateByUrl('/AddEmployee');
    }else{
      this.toast.error({
        detail: 'خطأ',
        summary: 'ليس لديك صلاحيات لإضافة موظف ',
        duration: 5000,
      });
    }
  }

  Openpopup(code: any, title: any,component:any) {
    var _popup = this.dialog.open(component, {
      width: '40%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data: {
        title: title,
        code: code
      }
    });
    _popup.afterClosed().subscribe(item => {
      // console.log(item)
      this.loadEmployees();
    })
  }

  EditEmployee(id: any) {
    if (this.isEdit == true) {
      const confirmDialogData: ConfirmationDialogData = {
        title: 'تأكيد التعديل',
        message: 'هل تريد تعديل الموظف؟',
      };

      const dialogRef = this.dialog.open(ConfirmPopupComponent, {
        width: '250px',
        data: confirmDialogData,
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.router.navigateByUrl(`/EditEmployee/${id}`);
        } else {
          console.log('delete canceled');
        }
      });
    } else {
      this.toast.error({
        detail: 'خطأ',
        summary: 'ليس لديك صلاحيات للتعديل ',
        duration: 5000,
      });
    }
  }

 DeleteEmployee(id: any): void {
  if (this.isDelete == true) {
    const confirmDialogData: ConfirmationDialogData = {
      title: 'تأكيد الحذف',
      message: 'هل تريد حذف الموظف؟',
    };

    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      width: '250px',
      data: confirmDialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.Service.deleteEmployee(id).subscribe(
          (response) => {
            console.log('Employee deleted successfully');
            this.loadEmployees();
          },
          (error) => {
            console.error('Error deleting employee');
          }
        );
      } else {
        console.log('delete canceled');
      }
    });
  } else {
    this.toast.error({
      detail: 'خطأ',
      summary: 'ليس لديك صلاحيات لحذف موظف ',
      duration: 5000,
    });
  }
}
}