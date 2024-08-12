import { EmployeesAttendanceComponent } from './Components/employees-attendance/employees-attendance.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { EmployeeSalariesComponent } from './Components/employee-salaries/employee-salaries.component';
import { EmployeesComponent } from './Components/employees/employees.component';
import { AddEmployeeComponent } from './Components/add-employee/add-employee.component';
import { AddUserComponent } from './Components/add-user/add-user.component';
import { GeneralSettingsComponent } from './Components/Settings/general-settings/general-settings.component';
import { OfficialVacationsComponent } from './Components/Settings/official-vacations/official-vacations.component';
import { RoleViewComponent } from './Components/Roles/role-view/role-view.component';
import { RoleFormComponent } from './Components/Roles/role-form/role-form.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AuthGuard } from './Guards/auth.guard';
import { EditEmployeeComponent } from './Components/edit-employee/edit-employee.component';
import { Error404Component } from './Components/error404/error404.component';
import { UsersComponent } from './Components/users/users.component';
import { EditUserComponent } from './Components/edit-user/edit-user.component';
import { DepartmentsComponent } from './Components/departments/departments.component';
import { AddDepartmentComponent } from './Components/add-department/add-department.component';

const routes: Routes = [
  {path:'', redirectTo: 'login', pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'Dashboard', component:DashboardComponent, canActivate:[AuthGuard]},
  {path:'EmployeeSalaries', component:EmployeeSalariesComponent, canActivate:[AuthGuard]},
  {path:'Employees', component:EmployeesComponent, canActivate:[AuthGuard]},
  {path:'AddEmployee', component:AddEmployeeComponent, canActivate:[AuthGuard]},
  {path:'EditEmployee/:id', component:EditEmployeeComponent, canActivate:[AuthGuard]},
  {path:'Users', component:UsersComponent, canActivate:[AuthGuard]},
  {path:'AddUser', component:AddUserComponent, canActivate:[AuthGuard]},
  {path:'EditUser/:id', component:EditUserComponent, canActivate:[AuthGuard]},
  {path:'Attendance', component:EmployeesAttendanceComponent, canActivate:[AuthGuard]},
  {path:'GeneralSettings', component:GeneralSettingsComponent, canActivate:[AuthGuard]},
  {path:'OfficialVacations', component:OfficialVacationsComponent, canActivate:[AuthGuard]},
  {path:'RolePage', component:RoleViewComponent, canActivate:[AuthGuard]},
  {path:'RoleForm/add', component:RoleFormComponent, canActivate:[AuthGuard]},
  {path:'Departments', component:DepartmentsComponent, canActivate:[AuthGuard]},
  {path:'AddDepartment', component:AddDepartmentComponent, canActivate:[AuthGuard]},

  {path: '404', component: Error404Component, canActivate: [AuthGuard] },
  {path: '', component: Error404Component, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
