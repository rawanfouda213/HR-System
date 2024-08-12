import { style } from '@angular/animations';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { SaveRoleRequest } from 'src/app/Model/save-role-request';
import { RolesService } from 'src/app/Services/roles.service';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.css'],
})
export class RoleFormComponent implements OnInit, AfterViewInit {
  constructor(
    private route: ActivatedRoute,
    private roleService: RolesService,
    private toast: NgToastService,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params: any) => {
      this.roleId = params['id'];
      console.log(this.roleId);
    });
  }
  roleId: number = 0;

  ngOnInit(): void {
    if (this.roleId > 0) {
      // call api to get the role by id
      this.GetRoleById();
    } else {
      // api to get pagse then convert it to list of Roles
      this.GetListOfPages();
    }
  }
  ngAfterViewInit(): void {}
  GetRoleById() {
    this.roleService.getOneRole(this.roleId).subscribe({
      next: (value: any) => {
        this.RolesList.rolePermissionsDTOs = value.rolePermissionsDTOs;
        this.RoleName = value.role_Name;
        this.RolesList.role_Name = value.role_Name;
        this.RolesList.role_Id = value.role_Id;
        this.roleId = value.role_Id;
      },
      error(err) {},
    });
    console.log(this.roleId);
  }
  GetListOfPages() {
    this.roleService.getListOfPages().subscribe({
      next: (value) => {
        this.RolesList = value;
      },
    });
  }
  // saveRole() {
  //   this.roleService.saveRole(this.RolesList).subscribe({
  //     next: (value) => {
  //       this.toast.success({
  //         detail: 'نجاح',
  //         summary: 'تم الحفظ بنجاح',
  //         duration: 990,
  //       });
  //       setTimeout(() => {
  //         // window.location.reload();
  //         this.router.navigate(['/RolePage']);
  //       }, 1500);
  //     },
  //   });
  // }

  saveRole() {
    if (
      this.RolesList.role_Name != '' &&
      this.checkAnyPermissionTrue(this.RolesList)
    ) {
      this.roleService.saveRole(this.RolesList).subscribe({
        next: (value) => {
          this.toast.success({
            detail: 'نجاح',
            summary: 'تم الحفظ بنجاح',
            duration: 990,
          });
          setTimeout(() => {
            this.router.navigate(['/RolePage']);
          }, 1500);
        },
      });
    } else {
      this.toast.error({
        detail: 'خطأ',
        summary: 'من فضلك قم بكتابة اسم الصلاحية و اختر علي الأقل أذن واحد',
        duration: 5000,  
      });
    }
  }

  checkAnyPermissionTrue(saveRoleRequest: SaveRoleRequest): boolean {
    if (!saveRoleRequest.rolePermissionsDTOs) {
      return false;
    }

    for (const permission of saveRoleRequest.rolePermissionsDTOs) {
      if (
        permission.isAdd === true ||
        permission.isEdit === true ||
        permission.isDelete === true ||
        permission.isView === true
      ) {
        return true; 
      }
    }

    return false;
  }

  // api to get pages => List pages
  // ['app','home'] => convert to list of Roles
  RoleName: string = '';
  RolesList: SaveRoleRequest = {
    role_Id: 0,
    role_Name: '',
    rolePermissionsDTOs: [],
  };

  checkAll(event: any, index: number) {
    console.log(event.target.checked);
    console.log(index);
    const obj = this.RolesList.rolePermissionsDTOs![index];
    obj.isAdd = event.target.checked;
    obj.isView = event.target.checked;
    obj.isEdit = event.target.checked;
    obj.isDelete = event.target.checked;
  }
}
