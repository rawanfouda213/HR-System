import { Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { LoginResponse } from 'src/app/Model/login-response';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { NavbarService } from 'src/app/Services/navbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit, OnDestroy{
  loginForm: FormGroup;
  hide = true;
  showDrawer: boolean = true;

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthServiceService, public nav:NavbarService, private toast: NgToastService){
    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit(): void {
      this.nav.hide();
  }
  ngOnDestroy(): void {
      this.nav.display();
      this.nav.toggle();
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };

      // Call the login API
      this.authService.login(credentials).subscribe(
        (response: LoginResponse) => {
          this.loginForm.reset();
          this.authService.storeToken(response.token);
          this.authService.storeRole(response.role);
          this.toast.success({detail: "تم", summary: "تم تسجيل الدخول بنجاح", duration: 5000});
          this.router.navigate(['/Dashboard']);

          setTimeout(() => {
            window.location.reload();
          }, 300);
        },
        (error) => {
          console.error('Login failed:', error);
          this.toast.error({detail: "خطأ", summary: "لقد أدخلت البريد الالكتروني أو كلمة المرور خطأ", duration: 5000, position:'topCenter'});
          this.loginForm.reset();
        }
      );
    }
    
  }

}
