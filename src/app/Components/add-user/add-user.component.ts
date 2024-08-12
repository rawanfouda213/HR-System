import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { UserReq } from 'src/app/Model/user-req';
import { RoleResponse } from 'src/app/Model/role-response';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent {
  userForm: FormGroup;
  isButtonClicked: boolean = false;
  availableRoles: any[] = [];


  constructor(private fb: FormBuilder, private authService: AuthServiceService, private toast: NgToastService, private router: Router) {
    this.userForm = this.fb.group({
      User_Name: ['', Validators.required],
      Name: ['', Validators.required],
      Email: ['', [Validators.required]],
      Password: ['', Validators.required],
      Role_Id: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.authService.getRolesDropdown().subscribe(
      (roles) => {
        this.availableRoles = roles;
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }

  onSaveButtonClick(): void {
      if (this.userForm.valid) {
        const userReq: UserReq = this.userForm.value;

        this.authService.addUser(userReq).subscribe(
          (response) => {
            this.toast.success({
              detail: 'نجاح',
              summary: 'تم إضافة مسخدم جديد',
              duration: 5000,
            });
            this.userForm.reset();
            this.router.navigateByUrl('/Users');
          },
          (error) => {
            console.error('Error adding user:', error);
          }
        );
      }
    else {
      this.toast.error({
        detail: 'خطأ',
        summary: 'برجاء إدخال جميع البيانات ',
        duration: 5000,
      });
    }
  }

}
