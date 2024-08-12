import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { RoleResponse } from 'src/app/Model/role-response';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { RolesService } from 'src/app/Services/roles.service';
import { ConfirmPopupComponent, ConfirmationDialogData } from '../../confirm-popup/confirm-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-role-view',
  templateUrl: './role-view.component.html',
  styleUrls: ['./role-view.component.css'],
})
export class RoleViewComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageName: string = 'Roles';
  isAdd: boolean = false;
  isEdit: boolean = false;
  isDelete: boolean = false;
  roleResponse!: RoleResponse;
  getListOfPermission() {
    this.roleResponse = this.Auth.getRole()!;
    const RolePermissions = this.roleResponse.rolePermissionsDTOs?.find(
      (h) => h.page_Name == this.pageName
    );
    if(RolePermissions){
    this.isAdd = RolePermissions?.isAdd!;
    this.isEdit = RolePermissions?.isEdit!;
    this.isDelete = RolePermissions?.isDelete!;
    } else {
      this.router.navigate(['/404']);
    }
  }
  constructor(private rolesService: RolesService, private router: Router, private Auth: AuthServiceService, private toast: NgToastService, private dialog: MatDialog) {}
  ngOnInit(): void {
    this.getListOfRoles();
    this.getListOfPermission();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getListOfRoles() {
    this.rolesService.getRoles().subscribe({
      next: (value: any) => {
        this.RoleList = value;
        this.dataSource = new MatTableDataSource<RolesList>(this.RoleList);
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  RoleList: RolesList[] = [];

  displayedColumns: string[] = ['name', 'actions'];
  dataSource = new MatTableDataSource<RolesList>(this.RoleList);
  addRole() {
    if (this.isAdd == true) {
      this.router.navigate(['/RoleForm/add'], { queryParams: { id: 0 } });
    } else {
      this.toast.error({
        detail: 'خطأ',
        summary: 'ليس لديك صلاحيات لإضافة صلاحية جديدة',
        duration: 5000,
      });
    }
  }

  editRole(id: number) {
    if (this.isEdit == true) {
      const confirmDialogData: ConfirmationDialogData = {
        title: 'تأكيد التعديل',
        message: 'هل تريد تعديل المجموعة؟'
      };
  
      const dialogRef = this.dialog.open(ConfirmPopupComponent, {
        width: '250px',
        data: confirmDialogData,
      });
  
      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
      this.router.navigate(['/RoleForm/add'], { queryParams: { id: id } });
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
  
  deleteRole(id: number) {
    if (this.isDelete == true) {
      const confirmDialogData: ConfirmationDialogData = {
        title: 'تأكيد الحذف',
        message: 'هل تريد حذف المجموعة؟'
      };
  
      const dialogRef = this.dialog.open(ConfirmPopupComponent, {
        width: '250px',
        data: confirmDialogData,
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
      this.rolesService.deleteRole(id).subscribe({
        next: (value) => {
          this.getListOfRoles();
          this.toast.success({
            detail: 'تم',
            summary: 'تم حذف المجموعة بنجاح',
            duration: 5000,
          });
          
        },
      });
    }
   },
   (error) => {
     console.error('Error deleting User');
     this.toast.error({
       detail: 'خطأ',
       summary: 'يوجد خطأ في حذف المجموعة',
       duration: 5000,
     });
   }
 );
} else {
      this.toast.error({
        detail: 'خطأ',
        summary: 'ليس لديك صلاحيات للحذف ',
        duration: 5000,
      });
    }
  }
  
  Filterchange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

}

export interface RolesList {
  name: string;
  id: number;
  actions?: string;
}
