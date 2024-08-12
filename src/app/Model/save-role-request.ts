export interface SaveRoleRequest {
    role_Id?: number;
    role_Name?: string;
    rolePermissionsDTOs?: RolePermissionsDTO[];
  }
  export interface RolePermissionsDTO {
    RolePermission_Id?: number;
    isAdd?: boolean;
    isEdit?: boolean;
    isDelete?: boolean;
    isView?: boolean;
    page_Name?: string;
  }
  