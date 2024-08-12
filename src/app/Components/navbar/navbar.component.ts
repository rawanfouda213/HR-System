import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavbarService } from 'src/app/Services/navbar.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { Subscription } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';
import { RolePermissionsResponse, RoleResponse } from 'src/app/Model/role-response';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnDestroy, OnInit {
  badgevisible = false;
  badgevisibility() {
    this.badgevisible = true;
  }

  applyStyleForSecondButton: boolean = true;

  activeRoute: string = '';

  showNavbar: boolean = true;
  @ViewChild('drawer') drawer!: MatDrawer;

  subscription: Subscription;

  constructor(
    public nav: NavbarService,
    private router: Router,
    private auth: AuthServiceService,
  ) {
    this.subscription = this.nav.showNavbar.subscribe((value) => {
      this.showNavbar = value;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url;
        this.setActivePermission(this.activeRoute);
      }
    });
  }
  ngOnInit(): void {
    this.getRoleResponseFromLocalStorage();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout() {
    this.auth.signOut();
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }

  roleResponse: RoleResponse = {
    role_Id: 0,
    role_Name: '',
    rolePermissionsDTOs: [
      {
        activateRoute: '',
        routerLink: '',
        label: '',
        icon: '',
      },
    ],
  };
  getRoleResponseFromLocalStorage() {
    this.roleResponse = this.auth.getRole()!;
  }

  toggleActive(permission: any) {
    this.roleResponse.rolePermissionsDTOs?.forEach(item => {
        item.isActive = false;
    });
    permission.isActive = true;
}

  isActive(permission: RolePermissionsResponse): boolean {
    return permission.isActive || false;
  }

  setActivePermission(url: string): void {
    if (this.roleResponse && this.roleResponse.rolePermissionsDTOs) {
      const foundPermission = this.roleResponse.rolePermissionsDTOs.find(
        (permission) => permission.routerLink === url
      );
      if (foundPermission) {
        this.toggleActive(foundPermission);
      }
    }
  }

  toggleDrawer() {
    this.drawer.toggle();
}

toggleActiveAndDrawer(permission: any) {
  this.toggleActive(permission);
  this.drawer.toggle();
}

}
