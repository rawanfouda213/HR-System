import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserEdit} from 'src/app/Model/user-req';
import { AuthServiceService } from 'src/app/Services/auth-service.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  Service = inject(AuthServiceService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  editUser= this.formBuilder.group({
    name: ['', [Validators.required]],
    user_Name: ['', [Validators.required]],
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    // gender: [null, [Validators.required]],
    role_Id: ['', Validators.required]

  });

  userId!: any;
  isEdit = false;
  roles: any[] = []; 

  ngOnInit(): void {
    this.LoadUser();
    this.getRoles(); 
  }

  getRoles(): void {
    this.Service.getRolesDropdown()
      .subscribe(roles => {
        this.roles = roles;
      });
  }

  // LoadUser() {
  //   this.userId = this.route.snapshot.params['id'];
  //   if (this.userId) {
  //     this.isEdit = true;
  //     this.Service.getUserById(this.userId).subscribe((result) => {
  //       console.log(result);
  //       this.editUser.patchValue(result);
        
  //     });
  //   }
  // }

  LoadUser() {
    this.userId = this.route.snapshot.params['id'];
    if (this.userId) {
      this.isEdit = true;
      this.Service.getUserById(this.userId).subscribe((result: UserEdit) => {
        console.log(result);
        this.editUser.patchValue({
          name: result.name,
          user_Name: result.user_Name,
          email: result.email,
          password: result.password,
          role_Id: result.role_Id?.toString(),
        });
      });
    }
  }

  save() {
    console.log(this.editUser.value);
    const user: UserEdit = {
      name: this.editUser.value.name!,
      user_Name: this.editUser.value.user_Name!,
      email: this.editUser.value.email!,
      password: this.editUser.value.password!,
      role_Id: parseInt(this.editUser.value.role_Id!)
       };
      this.Service
        .editUser(this.userId, user)
        .subscribe(() => {
          console.log('success');
          this.router.navigateByUrl('/Users');
          this.LoadUser();
        });

  }
    closePage() { 
    this.router.navigateByUrl('/Users');
}

}


