import { Component, ElementRef, ViewChild } from '@angular/core';
import { Department } from 'src/app/Model/department';
import { ConfirmPopupComponent, ConfirmationDialogData } from '../confirm-popup/confirm-popup.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DepartmentsService } from 'src/app/Services/departments.service';
import { AllEmployeesService } from 'src/app/Services/all-employees.service';
import { AddDepartmentComponent, AddDepartmentData } from '../add-department/add-department.component';
import { EditDepartmentComponent, EditDepartmentData } from '../edit-department/edit-department.component';
import { RoleResponse } from 'src/app/Model/role-response';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent {

  departmentId:any;
  editedDept: any = {};
  dataSource:any;
  depts:any|any[];
  @ViewChild('input') input!: ElementRef;
  displayedColumns: string[] = ['departmentName', 'action'];
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  departmentName=new FormControl('', [Validators.required]);
  constructor(private fb: FormBuilder,private dialog: MatDialog,private router:Router,private Service:DepartmentsService, private authService: AuthServiceService, private toast: NgToastService) {
    this.getListOfPermission();
    this.loadDepartments();
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

      loadDepartments() {
        this.Service.getDepartments().subscribe((data) => {
          console.log(data);
          this.depts = data;
          this.dataSource = new MatTableDataSource<Department>(this.depts);
      
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
    
        });
      }   


  pageName: string = 'Departments';
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

      addDepartment(){
        if (this.isAdd == true) {
        const AddDepartmentData: AddDepartmentData = {
          title: ' إضافة قسم',
        };

        this.loadDepartments();
      
        const dialogRef = this.dialog.open(AddDepartmentComponent, {
          width: '550px',
          data: AddDepartmentData
        });
      }
      else{
        this.toast.error({
          detail: 'خطأ',
          summary: 'ليس لديك صلاحيات لإضافة قسم ',
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
          this.loadDepartments();
        })
      }
      DeleteDepartment(id: any): void {
        if (this.isDelete == true) {
        const confirmDialogData: ConfirmationDialogData = {
          title: 'تأكيد الحذف',
          message: 'هل تريد حذف القسم؟'
        };
      
        const dialogRef = this.dialog.open(ConfirmPopupComponent, {
          width: '250px',
          data: confirmDialogData
        });
      
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.Service.deleteDepartment(id)
              .subscribe(
                response => {
                  console.log('Department deleted successfully');
                  this.loadDepartments();
                },
                    error => {
                      console.error('Error deleting Department:', error);
                    }
                  );
          } else {
            console.log('delete canceled');
          }
        });

      }else {
          this.toast.error({
            detail: 'خطأ',
            summary: 'ليس لديك صلاحيات لحذف القسم ',
            duration: 5000,
          });
        }
      }

      EditDepartment(id: any): void {
        if (this.isEdit == true) {
        this.Service.getDepartmentById(id)
          .subscribe(
            response => {
              const department: Department = response;
              const editDepartmentData: EditDepartmentData = {
                title: 'تعديل القسم',
                departmentId: id,
                departmentName: department.departmentName
              };
            console.log(department.departmentName)
              const dialogRef = this.dialog.open(EditDepartmentComponent, {
                width: '550px',
                data: editDepartmentData
              });
            
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  this.loadDepartments();
                } else {
                  console.log('canceled');
                }
              });
              
            },
            error => {
              console.error('Error retrieving department', error);
            }
          );

        } else {
          this.toast.error({
            detail: 'خطأ',
            summary: 'ليس لديك صلاحيات للتعديل ',
            duration: 5000,
          });
        }
      }

}
