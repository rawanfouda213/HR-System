import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder,FormControl,FormGroup,ValidatorFn,Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { Department } from 'src/app/Model/department';
import { Employee } from 'src/app/Model/employee';
import { AllEmployeesService } from 'src/app/Services/all-employees.service';
import { DepartmentsService } from 'src/app/Services/departments.service';
const phoneValidator: ValidatorFn = (control: AbstractControl) => {
  const phoneRegex = /^(010|011|012|015)\d{8}$/;
  const valid = phoneRegex.test(control.value);
  return valid ? null : { invalidPhone: true };
}

const ageValidator: ValidatorFn = (control: AbstractControl) => {
  const today = new Date();
  const birthDate = new Date(control.value);
  const age = today.getFullYear() - birthDate.getFullYear();
  const valid = age >= 20;
  return valid ? null : { invalidAge: true };
}
const contractdateValidator: ValidatorFn = (control: AbstractControl) => {
  const contractdate = new Date(control.value);
  const minDate = new Date(2008, 12, 30);
  const valid = contractdate >= minDate;
  return valid ? null : { invalidDate: true };
};
const contracrtDateAfterDayDateValidator: ValidatorFn = (control: AbstractControl) => {
  const selectedDate = new Date(control.value);
  const currentDate = new Date();
  const valid = selectedDate <= currentDate;
  return valid ? null : { invalidDayDate: true };
};

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})

export class AddEmployeeComponent  {
  nationalIdErrorMessage: string | null = null;
  departments: Department[] = [];
  profileForm!: FormGroup ;
  name=new FormControl('', [Validators.required]);
  address=new FormControl('', [Validators.required]);
  phone=new FormControl('', [Validators.required,phoneValidator]);
  gender=new FormControl(null, [Validators.required]);
  nationality=new FormControl('', [Validators.required]);
  birthDate=new FormControl(null, [Validators.required,ageValidator]);
  nationalId=new FormControl('', [Validators.required]);
  contractdate=new FormControl(null, [Validators.required,contractdateValidator,contracrtDateAfterDayDateValidator]);
  netSalary=new FormControl(0, [Validators.required]);
  department=new FormControl('', [Validators.required]);
  attendanceTime=new FormControl(null, [Validators.required]);
  leaveTime=new FormControl(null, [Validators.required]);
  constructor(private fb: FormBuilder,private router:Router,private Service:AllEmployeesService, private service:DepartmentsService) {
    this.profileForm = this.fb.group({
      name: this.name,
      address:this.address ,
      phone:this.phone ,
      gender: this.gender,
      nationality: this.nationality,
      birthDate: this.birthDate,
      nationalId: this.nationalId,
      contractdate: this.contractdate,
      netSalary: this.netSalary,
      attendanceTime: this.attendanceTime,
      leaveTime: this.leaveTime,
      department: this.department,
    });
  }

  ngOnInit() {
    this.service.getDepartments().subscribe(
      (response: any) => {
        this.departments = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  save() {
    console.log(this.profileForm.value);
    const employee: Employee = {
      name: this.profileForm.value.name!,
      address: this.profileForm.value.address!,
      phone: this.profileForm.value.phone!,
      gender: this.profileForm.value.gender!,
      nationality: this.profileForm.value.nationality!,
      birthDate: this.profileForm.value.birthDate!,
      nationalId: this.profileForm.value.nationalId!,
      contractdate: this.profileForm.value.contractdate!,
      netSalary: this.profileForm.value.netSalary!,
      department: this.profileForm.value.department!,
      attendanceTime: this.profileForm.value.attendanceTime!,
      leaveTime: this.profileForm.value.leaveTime!,
    };
      this.Service
        .addEmployee(employee)
        .subscribe(() => {
          console.log('success');
          this.router.navigateByUrl('/Employees');
        },
        (error) => {
          if (error.status === 400 && error.error.NationalId && error.error.NationalId.length > 0) {
            this.nationalIdErrorMessage = 'هذا الموظف تم إضافته من قبل';
          } else {
            console.error(error);
          }
        },
        );
    }

  closePage() { 
    this.router.navigateByUrl('/Employees');
  }

}
