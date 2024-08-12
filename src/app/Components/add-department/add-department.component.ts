import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DepartmentsService } from 'src/app/Services/departments.service';
import { Router } from '@angular/router';
import { Department } from 'src/app/Model/department';
import { AllEmployeesService } from 'src/app/Services/all-employees.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.css']
})
export class AddDepartmentComponent {

  dataSource:MatTableDataSource<Department>;
  depts:any;
  deptForm!: FormGroup;
  @ViewChild('input') input!: ElementRef;
  displayedColumns: string[] = ["departmentName"];
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  duplicatedNameErrorMessage: string | null = null;
  departmentName=new FormControl('');
  constructor(private fb: FormBuilder,private router:Router,private Service:DepartmentsService, private toast: NgToastService, public dialogRef: MatDialogRef<AddDepartmentComponent>, @Inject(MAT_DIALOG_DATA) public data: AddDepartmentData) {
    this.deptForm = this.fb.group({
      departmentName: this.departmentName,
    });
    this.dataSource = new MatTableDataSource<Department>([]);
    this.loadDepartments();
  }

  save() {
    console.log(this.deptForm.value);
    const dept: Department = {
      departmentName: this.deptForm.value.departmentName!,
    };
    this.Service.addDepartment(dept).subscribe((newDepartment) => {
      console.log('success');
      this.toast.success({
        detail: 'تم',
        summary: 'تم إضافة القسم بنجاح ',
        duration: 5000,
      });
      this.dialogRef.close();
      
      setTimeout(() => {
        window.location.reload();
      }, 300);
  
      const newData = this.dataSource.data.slice();
      newData.push(newDepartment);
      this.dataSource.data = newData;
    },
    (error) => {
      if (error.status === 409) {
        this.duplicatedNameErrorMessage = 'هذا القسم موجود من قبل';
      } else {
        console.error(error);
      }
    },
    );
    
  }

      cancel() {
        this.dialogRef.close();

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
}
export interface AddDepartmentData {
  title: string;
}