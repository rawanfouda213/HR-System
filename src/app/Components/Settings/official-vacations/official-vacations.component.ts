import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PopupHolidayComponent } from '../popup-holiday/popup-holiday.component';
import { HolidayServiceService } from 'src/app/Services/holiday-service.service';
import { NgToastService } from 'ng-angular-popup';
import { HolidayDto } from 'src/app/Model/holiday-dto';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { RoleResponse } from 'src/app/Model/role-response';
import { Router } from '@angular/router';
import { ConfirmPopupComponent, ConfirmationDialogData } from '../../confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-official-vacations',
  templateUrl: './official-vacations.component.html',
  styleUrls: ['./official-vacations.component.css'],
})
export class OfficialVacationsComponent implements OnInit {
  newHoliday = { name: '', date: new Date() };
  holidays: any[] = [];
  editedHoliday: any = {};
  showEditForm: boolean = false;
  showValidationMessage = false;
  dataSource = new MatTableDataSource<any>(this.holidays);
  displayedColumns: string[] = ['name', 'date', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private holidayCounter: number = 0;

  constructor(
    private dialog: MatDialog,
    private holidayService: HolidayServiceService,
    private toast: NgToastService,
    private authService: AuthServiceService,
    private router:Router
  ) {}

  ngOnInit() {
    this.getListOfPermission();
    this.getListOfHolidaysFromAPI();
  }

  pageName: string = 'Official Vacations';
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

  loadHolidaysFromStorage() {
    const storedHolidays = localStorage.getItem('holidays');
    if (storedHolidays) {
      this.holidays = JSON.parse(storedHolidays);
      this.dataSource = new MatTableDataSource<any>(this.holidays);
    }
  }
  getListOfHolidaysFromAPI() {
    this.holidayService.getHolidays().subscribe({
      next: (value: any) => {
        this.holidays = value;
        this.dataSource = new MatTableDataSource<any>(this.holidays);
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  addRequest!: HolidayDto;
  addHoliday() {
    if (this.isAdd == true) {
      this.holidays.push({ ...this.newHoliday, id: this.generateUniqueId() });
      this.addRequest = {
        id: 0,
        name: this.newHoliday.name,
        date: this.newHoliday.date,
      };
      console.log(this.addRequest);
      this.holidayService.addHoliday(this.addRequest).subscribe({
        next: (value) => {
          this.newHoliday = { name: '', date: new Date() };

          this.toast.success({
            detail: 'نجاح',
            summary: 'تم الاضافة بنجاح',
            duration: 990,
          });
            this.getListOfHolidaysFromAPI();
        },
      });
    } else {
      this.toast.error({
        detail: 'خطأ',
        summary: 'ليس لديك صلاحيات لإضافة اجازة ',
        duration: 5000,
      });
    }
  }

  generateUniqueId(): number {
    return ++this.holidayCounter;
  }

  editHoliday(index: number) {
    if (this.isEdit == true) {
      this.editedHoliday = { ...this.holidays[index] };
      this.Openpopup(this.editedHoliday, 'Edit Holiday', PopupHolidayComponent);
    } else {
      this.toast.error({
        detail: 'خطأ',
        summary: 'ليس لديك صلاحيات لتعديل الاجازات ',
        duration: 5000,
      });
    }
  }

  Openpopup(data: any, title: any, component: any) {
    const dialogRef = this.dialog.open(component, {
      width: '40%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '700ms',
      data: {
        title: title,
        holidayData: data,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getListOfHolidaysFromAPI();
    });
  }

  confirmDelete(id: number) {
    if (this.isDelete == true) {
      // const confirmed = confirm('هل أنت متأكد أنك تريد الحذف');
      const confirmed: ConfirmationDialogData = {
        title: 'تأكيد الحذف',
        message: 'هل تريد حذف الاجازة؟',
      };
  
      const dialogRef = this.dialog.open(ConfirmPopupComponent, {
        width: '250px',
        data: confirmed,
      });

      dialogRef.afterClosed().subscribe((result) => {
      if (confirmed) {
        this.holidayService.deleteHoliday(id).subscribe({
          next: (value) => {
            this.toast.success({
              detail: 'نجاح',
              summary: 'تم الحذف بنجاح',
              duration: 990,
            });
              this.getListOfHolidaysFromAPI();
          },
        });
      }
    });
    } else {
      this.toast.error({
        detail: 'خطأ',
        summary: 'ليس لديك صلاحيات لحذف الاجازات ',
        duration: 5000,
      });
    }
  }
  Filterchange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  updateDataSource() {
    this.dataSource = new MatTableDataSource<any>(this.holidays);
    this.dataSource.paginator = this.paginator;
  }
}
