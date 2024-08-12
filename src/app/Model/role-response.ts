export interface RoleResponse {
    role_Id?: number;
    role_Name?: string;
    rolePermissionsDTOs?: RolePermissionsResponse[];
  }
  export interface RolePermissionsResponse {
    RolePermission_Id?: number;
    isAdd?: boolean;
    isEdit?: boolean;
    isDelete?: boolean;
    isView?: boolean;
    page_Id?: number;
    page_Name?: string;
    icon?: string;
    label?: string;
    routerLink?: string;
    activateRoute?: string;
    isActive?: boolean;
  }
  