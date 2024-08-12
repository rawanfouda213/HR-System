import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatToolbarModule} from "@angular/material/toolbar"
import {MatMenuModule} from "@angular/material/menu"
import {MatListModule} from "@angular/material/list"
import {MatSidenavModule} from "@angular/material/sidenav"
import {MatBadgeModule} from "@angular/material/badge"
import {MatButtonModule} from "@angular/material/button"
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { NgToastModule } from 'ng-angular-popup';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { EmployeeSalariesComponent } from './Components/employee-salaries/employee-salaries.component';
import { PopupComponent } from './Components/popup/popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EmployeesComponent } from './Components/employees/employees.component';
import { AddEmployeeComponent } from './Components/add-employee/add-employee.component';
import { AddUserComponent } from './Components/add-user/add-user.component';
import { EmployeesAttendanceComponent } from './Components/employees-attendance/employees-attendance.component';
import { GeneralSettingsComponent } from './Components/Settings/general-settings/general-settings.component';
import { OfficialVacationsComponent } from './Components/Settings/official-vacations/official-vacations.component';
import { PopupHolidayComponent } from './Components/Settings/popup-holiday/popup-holiday.component';
import { RoleViewComponent } from './Components/Roles/role-view/role-view.component';
import { RoleFormComponent } from './Components/Roles/role-form/role-form.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
// import { AuthServiceService } from './Services/auth-service.service';
import { TokenInterceptor } from './Interceptors/token.interceptor';
import { EmployeePrintComponent } from './Components/employee-print/employee-print.component';
import { EditEmployeeComponent } from './Components/edit-employee/edit-employee.component';
import { SalaryDetailsPopupComponent } from './Components/employee-salaries/SalaryDetailsPopup/salary-details-popup/salary-details-popup.component';
import { ConfirmPopupComponent } from './Components/confirm-popup/confirm-popup.component';
import { Error404Component } from './Components/error404/error404.component';
import { UsersComponent } from './Components/users/users.component';
import { EditUserComponent } from './Components/edit-user/edit-user.component';
import { AddAttendancePopupComponent } from './Components/employees-attendance/Popup Attendance/add-attendance-popup/add-attendance-popup.component';
import { EditAttendancePopupComponent } from './Components/employees-attendance/Popup Attendance/edit-attendance-popup/edit-attendance-popup.component';
import { AddDepartmentComponent } from './Components/add-department/add-department.component';
import { EditDepartmentComponent } from './Components/edit-department/edit-department.component';
import { DepartmentsComponent } from './Components/departments/departments.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    EmployeeSalariesComponent,
    PopupComponent,
    EmployeesComponent,
    AddEmployeeComponent,
    AddUserComponent,
    EmployeesAttendanceComponent,
    GeneralSettingsComponent,
    OfficialVacationsComponent,
    PopupHolidayComponent,
    RoleViewComponent,
    RoleFormComponent,
    DashboardComponent,
    EmployeePrintComponent,
    EditEmployeeComponent,
    SalaryDetailsPopupComponent,
    ConfirmPopupComponent,
    Error404Component,
    UsersComponent,
    EditUserComponent,
    AddAttendancePopupComponent,
    EditAttendancePopupComponent,
    AddDepartmentComponent,
    EditDepartmentComponent,
    DepartmentsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule, 
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatMenuModule,
    MatListModule,
    MatSidenavModule,
    MatBadgeModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonToggleModule,
    NgToastModule,
  ],
//   providers: [{
//     provide: HTTP_INTERCEPTORS,
//     useClass:TokenInterceptor,
//     multi:true
// }],
providers: [{
  provide: HTTP_INTERCEPTORS,
  useClass:TokenInterceptor,
  multi:true
}],
  bootstrap: [AppComponent]
})
export class AppModule { }
