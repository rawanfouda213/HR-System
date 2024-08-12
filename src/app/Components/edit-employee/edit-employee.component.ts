import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from 'src/app/Model/department';
import { Employee } from 'src/app/Model/employee';
import { Gender } from 'src/app/Model/gender';
import { AllEmployeesService } from 'src/app/Services/all-employees.service';
import { DepartmentsService } from 'src/app/Services/departments.service';
@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit{
  formBuilder = inject(FormBuilder);
  Service = inject(AllEmployeesService);
  service=inject(DepartmentsService)
  router = inject(Router);
  route = inject(ActivatedRoute);
  departments: Department[] = [];
  editForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    address: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    gender: [null, [Validators.required]],
    nationality: ['', [Validators.required]],
    birthDate: [null, [Validators.required]],
    nationalId: ['', [Validators.required]],
    contractdate: [null, [Validators.required]],
    netSalary: [0, [Validators.required]],
    department: ['', [Validators.required]],
    attendanceTime: [null, [Validators.required]],
    leaveTime: [null, [Validators.required]],
  });
  employeeId!: any;
  isEdit = false;
  genders: Gender[] = [];
  ngOnInit(): void {
    this.LoadEmployee();
    this.service.getDepartments().subscribe(
      (response: any) => {
        this.departments = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  LoadEmployee() {
    this.employeeId = this.route.snapshot.params['id'];
    if (this.employeeId) {
      this.isEdit = true;
      this.Service.getEmployeeById(this.employeeId).subscribe((result) => {
        console.log(result);
        this.editForm.patchValue(result);
        // this.getEmployeeGender(result.genderId);
      });
    }
  }
  // getEmployeeGender(genderId: any) {
  //   this.Service.getEmployeeGender(genderId).subscribe((result) => {
  //     console.log(result);
  //     this.genders.push(result);
  //     console.log(this.genders)
  //   });
  // }
  isMaleSelected(): boolean {
    return this.editForm.controls['gender'].value === 'Male';
  }

  isFemaleSelected(): boolean {
    return this.editForm.controls['gender'].value === 'Female';
  }
  save() {
    console.log(this.editForm.value);
    const employee: Employee = {
      name: this.editForm.value.name!,
      address: this.editForm.value.address!,
      phone: this.editForm.value.phone!,
      gender: this.editForm.value.gender!,
      nationality: this.editForm.value.nationality!,
      birthDate: this.editForm.value.birthDate!,
      nationalId: this.editForm.value.nationalId!,
      contractdate: this.editForm.value.contractdate!,
      netSalary: this.editForm.value.netSalary!,
      attendanceTime: this.editForm.value.attendanceTime!,
      leaveTime: this.editForm.value.leaveTime!,
    };
    employee.department = this.editForm.value.department!;

      this.Service.editEmployee(this.employeeId, employee).subscribe(() => {
          console.log('success');
          this.router.navigateByUrl('/Employees');
          this.LoadEmployee();
        });
  }
    closePage() { 
    this.router.navigateByUrl('/Employees');
}
}