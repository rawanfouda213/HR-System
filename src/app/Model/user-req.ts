export interface UserReq {
    User_Name: string;
    Name?: string;
    Email: string;
    Password: string;
    Role_Id?: number;
  }

  export interface UserEdit {
    user_Name?: string;
    name?: string;
    email: string;
    password: string;
    role_Id?: any;
  }