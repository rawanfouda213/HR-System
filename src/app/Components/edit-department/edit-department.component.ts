import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentsService } from 'src/app/Services/departments.service';
import { Department } from 'src/app/Model/department';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.css']
})
export class EditDepartmentComponent implements OnInit {
  deptForm: FormGroup;
  duplicatedNameErrorMessage: string | null = null;

  constructor(public dialogRef: MatDialogRef<EditDepartmentComponent>, @Inject(MAT_DIALOG_DATA) public data: EditDepartmentData, private formBuilder: FormBuilder, public Service: DepartmentsService, private toast: NgToastService) {
    this.deptForm = this.formBuilder.group({
      departmentName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.deptForm.patchValue({
      departmentName: this.data.departmentName
    });
  }

  save() {
    if (this.deptForm.valid) {
      const editedDept: Department = {
        departmentName: this.deptForm.value.departmentName,
        departmentId: this.data.departmentId
      };
      this.Service.editDepartment(this.data.departmentId, editedDept)
        .subscribe(
          response => {
            console.log('Department updated successfully');
            this.toast.success({
              detail: 'تم',
              summary: 'تم تعديل القسم بنجاح',
              duration: 5000,
            });
            this.dialogRef.close(true);
          },
          error => {
            if (error.status === 409) {
              this.duplicatedNameErrorMessage = 'هذا القسم موجود من قبل';
            } else {
              console.error(error);
            }
          }
        );
    }
  }
  cancel(){
    this.dialogRef.close(false);
  }
}

export interface EditDepartmentData {
  title: string;
  departmentId: any;
  departmentName:string
}