import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmPopupComponent, ConfirmationDialogData } from '../confirm-popup/confirm-popup.component';
import { RoleResponse } from 'src/app/Model/role-response';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from 'src/app/Model/employee';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AllEmployeesService } from 'src/app/Services/all-employees.service';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  dataSource: any;
  employees:any;
  roles: any[] = []; 

  @ViewChild('input') input!: ElementRef;
  displayedColumns: string[] = ["Name","userName", "email", "Role_Name", "action"];
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(private dialog: MatDialog, private router: Router ,private authService: AuthServiceService, private toast: NgToastService) {
    this.loadEmployees();
  }
  loadEmployees() {
    this.authService.getAllUsers().subscribe((data) => {
      console.log(data);
      this.employees = data;
      this.dataSource = new MatTableDataSource<Employee>(this.employees);
  
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    });
  }

  ngOnInit(): void {
    this.getListOfPermission();
    this.loadRolesDropdown();
  }

  loadRolesDropdown() {
    this.authService.getRolesDropdown().subscribe((data) => {
      this.roles = data;
    });
  }

  getRoleName(roleId: number): string {
    const role = this.roles.find(role => role.id === roleId);
    return role ? role.name : 'غير معروف';
  }

  pageName: string = 'Users';
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

  // addUser(){
  //   this.router.navigateByUrl('/AddUser');
  // }

  addUser() {
    if (this.isAdd == true) {
      this.router.navigateByUrl('/AddUser');
    }else{
      this.toast.error({
        detail: 'خطأ',
        summary: 'ليس لديك صلاحيات لإضافة مستخدم ',
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

EditUser(id: any) {
  if (this.isEdit == true) {
    const confirmDialogData: ConfirmationDialogData = {
      title: 'تأكيد التعديل',
      message: 'هل تريد تعديل المستخدم؟'
    };

    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      width: '250px',
      data: confirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.router.navigateByUrl(`/EditUser/${id}`);
      } else {
        console.log('Edit canceled');
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

  DeleteUser(id: any): void {
    if (this.isDelete == true) {
      const confirmDialogData: ConfirmationDialogData = {
        title: 'تأكيد الحذف',
        message: 'هل تريد حذف المستخدم؟'
      };
  
      const dialogRef = this.dialog.open(ConfirmPopupComponent, {
        width: '250px',
        data: confirmDialogData,
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.authService.deleteUser(id).subscribe(
            (response) => {
              console.log('User deleted successfully');

              this.toast.success({
                detail: 'تم',
                summary: 'تم حذف المستخدم بنجاح',
                duration: 5000,
              });

              this.loadEmployees();
            },
            (error) => {
              console.error('Error deleting User');
              this.toast.error({
                detail: 'خطأ',
                summary: 'يوجد خطأ في حذف المستخدم',
                duration: 5000,
              });
            }
          );
        } else {
          console.log('delete canceled');
        }
      });
    } else {
      this.toast.error({
        detail: 'خطأ',
        summary: 'ليس لديك صلاحيات لحذف مستخدم ',
        duration: 5000,
      });
    }
  }

}
