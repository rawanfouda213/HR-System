import { Component, OnInit } from '@angular/core';
import { GeneralSettingsServiceService } from 'src/app/Services/general-settings-service.service';
import { GeneralSettingsRequest } from './general-settings-request';
import { RoleResponse } from 'src/app/Model/role-response';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.css'],
})
export class GeneralSettingsComponent implements OnInit {

  selectedFirstWeekendDay: string = 'اختر';
  selectedSecondWeekendDay: string = 'اختر';
  extraHourRate: number=0;
  discountHourRate: number=0;
  method: string = 'hour';


  constructor(private generalService: GeneralSettingsServiceService, private authService: AuthServiceService, private toast: NgToastService, private router: Router) {
    this.extraHourRate ;
    this.discountHourRate ;
  }
  ngOnInit(): void {
    this.getListOfPermission();
    this.GetGeneralSettings();
  }

  pageName: string = 'General Settings';
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


  GetGeneralSettings() {
    this.generalService.GetSettings().subscribe({
      next: (value: any) => {
        console.log(value);
        this.selectedFirstWeekendDay = value.selectedFirstWeekendDay;
        this.selectedSecondWeekendDay = value.selectedSecondWeekendDay;
        this.extraHourRate = value.extraHourRate;
        this.discountHourRate = value.discountHourRate;
        this.method = value.method;
      },
    });
  }
  saveRequest!: GeneralSettingsRequest;

Save() {
  if (this.isAdd == true) {
    if (this.selectedFirstWeekendDay != this.selectedSecondWeekendDay) {
      this.saveRequest = {
        selectedFirstWeekendDay: this.selectedFirstWeekendDay,
        selectedSecondWeekendDay: this.selectedSecondWeekendDay,
        extraHourRate: this.extraHourRate,
        discountHourRate: this.discountHourRate,
        Method: this.method,
      };
      this.generalService.saveSettings(this.saveRequest).subscribe({
        next: (value) => {
          this.toast.success({
            detail: 'نجاح',
            summary: 'تم الحفظ بنجاح',
            duration: 5000,
          });
        },
        error: (err) => {
          this.toast.error({
            detail: 'خطأ',
            summary: 'حدث خطأ أثناء الحفظ',
            duration: 5000,
          });
        },
      });
    } else {
      this.toast.warning({
        detail: 'خطأ',
        summary: 'لا يمكن أن يكون يوم الاجازة الاول نفس اليوم الثاني',
        duration: 5000,
      });
    }
  } else {
    this.toast.error({
      detail: 'خطأ',
      summary: 'ليس لديك صلاحيات لحفظ الاعدادات العامة',
      duration: 5000,
    });
  }
}

}
